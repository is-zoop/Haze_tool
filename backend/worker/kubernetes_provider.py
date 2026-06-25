"""KubernetesRuntimeProvider — 真实 K8s 操作，K8s 逻辑只在此文件中。

安全策略（随每次 deploy 同步创建）：
  - Pod securityContext: runAsNonRoot, runAsUser=1000, 无 ServiceAccount token
  - 容器 securityContext: allowPrivilegeEscalation=false, readOnlyRootFilesystem=true, drop ALL
  - NetworkPolicy ingress: 只允许 haze-system Namespace（Gateway 所在）
  - NetworkPolicy egress: 允许 DNS + 外部 HTTPS，禁止访问内部集群网络
"""
from __future__ import annotations

import time
from datetime import datetime, timezone

import kubernetes
import kubernetes.client
import kubernetes.client.exceptions
import kubernetes.config

from app.modules.mcp_runtime.models import McpDeployment
from worker.config import WorkerSettings


class KubernetesRuntimeProvider:
    """调用 kubernetes Python SDK 操作 haze-runtime Namespace 下的 MCP Server 资源。"""

    def __init__(self, settings: WorkerSettings) -> None:
        # 优先尝试 in-cluster，失败时 fallback 到 kubeconfig
        if settings.k8s_in_cluster:
            kubernetes.config.load_incluster_config()
        else:
            kubernetes.config.load_kube_config(config_file=settings.k8s_config_path)
        self._apps = kubernetes.client.AppsV1Api()
        self._core = kubernetes.client.CoreV1Api()
        self._net = kubernetes.client.NetworkingV1Api()
        self._settings = settings

    # ── 内部工具 ──────────────────────────────────────────────────────────────

    @staticmethod
    def _labels(deployment_name: str, asset_code: str) -> dict[str, str]:
        return {
            "app": deployment_name,
            "haze.io/type": "mcp-server",
            "haze.io/asset-code": asset_code,
        }

    def _create_or_patch(self, resource_type: str, name: str, namespace: str, body: object) -> None:
        """通用 create-or-patch：先 create，409 冲突则 replace（整体更新）。"""
        try:
            if resource_type == "deployment":
                self._apps.create_namespaced_deployment(namespace, body)
            elif resource_type == "service":
                self._core.create_namespaced_service(namespace, body)
            elif resource_type == "networkpolicy":
                self._net.create_namespaced_network_policy(namespace, body)
        except kubernetes.client.exceptions.ApiException as exc:
            if exc.status != 409:
                raise
            # 已存在则替换
            if resource_type == "deployment":
                self._apps.replace_namespaced_deployment(name, namespace, body)
            elif resource_type == "service":
                # Service replace 需要先读取 resourceVersion
                existing = self._core.read_namespaced_service(name, namespace)
                body.metadata.resource_version = existing.metadata.resource_version
                self._core.replace_namespaced_service(name, namespace, body)
            elif resource_type == "networkpolicy":
                self._net.replace_namespaced_network_policy(name, namespace, body)

    # ── 核心操作 ──────────────────────────────────────────────────────────────

    def deploy(
        self,
        dep: McpDeployment,
        port: int,
        endpoint: str,
    ) -> tuple[str, str, str]:
        """创建（或更新）Deployment / Service / NetworkPolicy。

        返回 (image_url, internal_service_name, internal_url)。
        """
        s = self._settings
        name = dep.deployment_name
        ns = dep.namespace
        image = dep.image_url or s.mcp_placeholder_image
        asset_code = name.removeprefix("mcp-")  # mcp-{code} → {code}
        labels = self._labels(name, asset_code)

        # ── Deployment ────────────────────────────────────────────────────────
        deployment = kubernetes.client.V1Deployment(
            metadata=kubernetes.client.V1ObjectMeta(
                name=name,
                namespace=ns,
                labels=labels,
            ),
            spec=kubernetes.client.V1DeploymentSpec(
                replicas=1,
                selector=kubernetes.client.V1LabelSelector(
                    match_labels={"app": name},
                ),
                template=kubernetes.client.V1PodTemplateSpec(
                    metadata=kubernetes.client.V1ObjectMeta(labels=labels),
                    spec=kubernetes.client.V1PodSpec(
                        automount_service_account_token=False,
                        security_context=kubernetes.client.V1PodSecurityContext(
                            run_as_non_root=True,
                            run_as_user=1000,
                            run_as_group=1000,
                            fs_group=1000,
                        ),
                        containers=[
                            kubernetes.client.V1Container(
                                name="mcp-server",
                                image=image,
                                ports=[kubernetes.client.V1ContainerPort(container_port=port)],
                                resources=kubernetes.client.V1ResourceRequirements(
                                    requests={
                                        "cpu": s.mcp_cpu_request,
                                        "memory": s.mcp_memory_request,
                                    },
                                    limits={
                                        "cpu": s.mcp_cpu_limit,
                                        "memory": s.mcp_memory_limit,
                                    },
                                ),
                                security_context=kubernetes.client.V1SecurityContext(
                                    allow_privilege_escalation=False,
                                    read_only_root_filesystem=True,
                                    capabilities=kubernetes.client.V1Capabilities(
                                        drop=["ALL"],
                                    ),
                                ),
                                volume_mounts=[
                                    kubernetes.client.V1VolumeMount(
                                        name="tmp",
                                        mount_path="/tmp",
                                    )
                                ],
                            )
                        ],
                        volumes=[
                            kubernetes.client.V1Volume(
                                name="tmp",
                                empty_dir=kubernetes.client.V1EmptyDirVolumeSource(),
                            )
                        ],
                    ),
                ),
            ),
        )
        self._create_or_patch("deployment", name, ns, deployment)

        # ── Service ───────────────────────────────────────────────────────────
        service = kubernetes.client.V1Service(
            metadata=kubernetes.client.V1ObjectMeta(
                name=name,
                namespace=ns,
                labels=labels,
            ),
            spec=kubernetes.client.V1ServiceSpec(
                selector={"app": name},
                ports=[
                    kubernetes.client.V1ServicePort(
                        port=port,
                        target_port=port,
                    )
                ],
                type="ClusterIP",
            ),
        )
        self._create_or_patch("service", name, ns, service)

        # ── NetworkPolicy ─────────────────────────────────────────────────────
        netpol_name = f"{name}-netpol"
        netpol = kubernetes.client.V1NetworkPolicy(
            metadata=kubernetes.client.V1ObjectMeta(
                name=netpol_name,
                namespace=ns,
            ),
            spec=kubernetes.client.V1NetworkPolicySpec(
                pod_selector=kubernetes.client.V1LabelSelector(
                    match_labels={"app": name},
                ),
                policy_types=["Ingress", "Egress"],
                ingress=[
                    kubernetes.client.V1NetworkPolicyIngressRule(
                        _from=[
                            kubernetes.client.V1NetworkPolicyPeer(
                                namespace_selector=kubernetes.client.V1LabelSelector(
                                    match_labels={
                                        "kubernetes.io/metadata.name": "haze-system"
                                    }
                                )
                            )
                        ]
                    )
                ],
                egress=[
                    # DNS（UDP/TCP 53）
                    kubernetes.client.V1NetworkPolicyEgressRule(
                        ports=[
                            kubernetes.client.V1NetworkPolicyPort(port=53, protocol="UDP"),
                            kubernetes.client.V1NetworkPolicyPort(port=53, protocol="TCP"),
                        ]
                    ),
                    # 允许外部（禁止内部 RFC 1918 网段）
                    kubernetes.client.V1NetworkPolicyEgressRule(
                        to=[
                            kubernetes.client.V1NetworkPolicyPeer(
                                ip_block=kubernetes.client.V1IPBlock(
                                    cidr="0.0.0.0/0",
                                    _except=[
                                        "10.0.0.0/8",
                                        "172.16.0.0/12",
                                        "192.168.0.0/16",
                                    ],
                                )
                            )
                        ]
                    ),
                ],
            ),
        )
        self._create_or_patch("networkpolicy", netpol_name, ns, netpol)

        internal_url = f"http://{name}.{ns}.svc.cluster.local:{port}{endpoint}"
        return image, name, internal_url

    def wait_for_ready(self, dep: McpDeployment, timeout_seconds: int) -> bool:
        """轮询 Deployment.status.ready_replicas 直到 >= 1 或超时。"""
        deadline = time.monotonic() + timeout_seconds
        while time.monotonic() < deadline:
            d = self._apps.read_namespaced_deployment(dep.deployment_name, dep.namespace)
            if (d.status.ready_replicas or 0) >= 1:
                return True
            time.sleep(self._settings.pod_ready_poll_seconds)
        return False

    def start(self, dep: McpDeployment) -> None:
        """将 replicas 设为 1，恢复已停止的服务。"""
        self._apps.patch_namespaced_deployment(
            dep.deployment_name,
            dep.namespace,
            {"spec": {"replicas": 1}},
        )

    def stop(self, dep: McpDeployment) -> None:
        """将 replicas 设为 0，停止服务（保留 K8s 资源）。"""
        self._apps.patch_namespaced_deployment(
            dep.deployment_name,
            dep.namespace,
            {"spec": {"replicas": 0}},
        )

    def restart(self, dep: McpDeployment) -> None:
        """更新 Pod annotation 触发滚动重启，不停机。"""
        ts = datetime.now(timezone.utc).isoformat()
        self._apps.patch_namespaced_deployment(
            dep.deployment_name,
            dep.namespace,
            {
                "spec": {
                    "template": {
                        "metadata": {
                            "annotations": {
                                "kubectl.kubernetes.io/restartedAt": ts,
                            }
                        }
                    }
                }
            },
        )

    def get_pod_logs(self, dep: McpDeployment, tail_lines: int = 100) -> str:
        """返回最新 Pod 日志，无 Pod 时返回空字符串。"""
        pods = self._core.list_namespaced_pod(
            dep.namespace,
            label_selector=f"app={dep.deployment_name}",
        )
        if not pods.items:
            return ""
        pod_name = pods.items[0].metadata.name
        try:
            return self._core.read_namespaced_pod_log(
                pod_name,
                dep.namespace,
                tail_lines=tail_lines,
            )
        except kubernetes.client.exceptions.ApiException:
            return ""
