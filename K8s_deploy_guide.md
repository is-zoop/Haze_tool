# Haze MCP Server 部署指南

本文档覆盖两个场景：**本地开发**（Windows + Docker Desktop）和 **Linux 生产**（K8s 集群）。

---

## 架构说明

```
调用方
  │
  ▼
Gateway 服务（FastAPI，backend/gateway/）
  │  查 mcp_gateway_routes → target_url
  ▼
MCP Server Pod（K8s 运行 server.py 容器）
  │
  ▼
返回 JSON-RPC 响应
```

三个独立进程共享同一 MySQL 数据库：
- **Haze Backend**（`uvicorn app.main:app`）- API 服务
- **Deploy Worker**（`python -m worker.main`）- 消费部署任务
- **MCP Gateway**（`python -m gateway.main`）- 代理 MCP 调用

---

## 环境变量速查（`backend/.env`）

| 变量 | 本地开发值 | 生产值 | 说明 |
|---|---|---|---|
| `DATABASE_URL` | `mysql+pymysql://...@127.0.0.1:3306/haze` | 生产 DB 地址 | 三个进程共用 |
| `K8S_IN_CLUSTER` | `false` | `true` | false=kubeconfig，true=ServiceAccount |
| `K8S_CONFIG_PATH` | （空，默认 `~/.kube/config`） | 不需要 | 仅 in_cluster=false 时有效 |
| `K8S_NAMESPACE` | `haze-runtime` | `haze-runtime` | MCP Pod 运行的 Namespace |
| `REGISTRY_URL` | `host.docker.internal:5000` | `registry.yourcompany.com` | 镜像仓库地址 |
| `REGISTRY_PUSH_ENABLED` | `false` | `true` | false=跳过 push，Docker Desktop 无需 push |
| `K8S_VERIFY_SSL` | `false` | `true` | false=跳过 TLS 证书验证（本地自签名证书） |
| `REGISTRY_PROJECT` | `haze-mcp` | `haze-mcp` | 仓库内项目名 |

---

## 一、本地开发环境（Windows + Docker Desktop）

### 前置条件

- Docker Desktop 已安装并运行
- Python 3.11+，已安装 `backend/requirements.txt`

### 第 1 步：启用 Docker Desktop 内置 K8s

> Docker Desktop → Settings → Kubernetes → **Enable Kubernetes** → Apply & Restart

等待右下角 K8s 图标变绿（约 2 分钟）。

验证：
```powershell
kubectl get nodes
# NAME             STATUS   ROLES           AGE
# docker-desktop   Ready    control-plane   2m
```

### 第 2 步：创建 Namespace

```powershell
kubectl create namespace haze-runtime
kubectl create namespace haze-system

# NetworkPolicy 需要根据标签匹配 haze-system，此标签 Docker Desktop 默认不加，手动补上
kubectl label namespace haze-system kubernetes.io/metadata.name=haze-system
```

### 第 3 步：配置 `.env`

Docker Desktop K8s 与宿主机 Docker **共用同一个镜像存储**，`docker build` 出的镜像 K8s 直接可用，**不需要搭建本地 Registry，也不需要 push**。

在 `backend/.env` 中添加（或确认已存在）：

```env
K8S_IN_CLUSTER=false
REGISTRY_PUSH_ENABLED=false   # Docker Desktop 无需 push，K8s 直接用本地镜像
```

> `K8S_CONFIG_PATH` 不需要设置，默认读取 `~/.kube/config`（Docker Desktop 自动写入）。
>
> `REGISTRY_URL` 保持默认即可，build 时的 tag 前缀不影响本地 K8s 使用。

### 第 5 步：启动三个进程

```powershell
cd E:\HazeToolPlat\backend

# 终端 1：Backend API
uvicorn app.main:app --reload --port 8000

# 终端 2：Deploy Worker
python -m worker.main

# 终端 3：MCP Gateway
python -m gateway.main
```

### 第 6 步：部署一个 MCP 能力

1. 将 `demo/demo_http/` 目录打包成 ZIP（**只打包内容，不含文件夹**）：

```powershell
cd E:\HazeToolPlat\demo\demo_http
Compress-Archive -Path mcp.yaml, server.py, requirements.txt -DestinationPath ..\demo_http.zip -Force
```

2. 在 Haze 平台创建 HTTP MCP 能力，上传 `demo_http.zip`，通过审核后点击**服务部署**。

3. Worker 日志应显示：

```
INFO  docker build 成功
INFO  docker push 成功 → host.docker.internal:5000/haze-mcp/mcp-xxx:1.0.0
INFO  K8s Deployment/mcp-xxx 已创建
INFO  K8s Service/mcp-xxx (NodePort) 已创建
INFO  任务 X (deploy) 执行成功
```

### 第 7 步：验证

```powershell
# 查看 K8s 资源
kubectl get all -n haze-runtime

# 查看分配的 NodePort
kubectl get service -n haze-runtime
# NAME      TYPE       PORT(S)
# mcp-xxx   NodePort   8000:31234/TCP   ← 31234 即宿主机端口

# 调用 Gateway 测试全链路
curl -X POST http://localhost:8001/assets/{asset_code}/mcp `
     -H "Content-Type: application/json" `
     -d '{"jsonrpc":"2.0","method":"tools/list","id":1}'
```

---

## 二、Linux 生产环境

### 前置条件

- K8s 集群可用（k3s / kubeadm / EKS / GKE / AKS 均可）
- 私有镜像仓库（Harbor、ECR、GCR 等）
- Haze Backend / Worker / Gateway 以 K8s Deployment 运行在集群内

### 第 1 步：创建 Namespace 和 ServiceAccount

```bash
kubectl create namespace haze-runtime
kubectl create namespace haze-system
kubectl label namespace haze-system kubernetes.io/metadata.name=haze-system

# Worker 需要在 haze-runtime 内创建 Deployment/Service/NetworkPolicy
# 为 Worker Pod 创建 ServiceAccount 并绑定权限
kubectl create serviceaccount haze-worker -n haze-system

cat <<EOF | kubectl apply -f -
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: haze-worker-role
rules:
- apiGroups: ["apps"]
  resources: ["deployments"]
  verbs: ["get","list","create","update","patch","delete"]
- apiGroups: [""]
  resources: ["services","pods","pods/log"]
  verbs: ["get","list","create","update","patch","delete"]
- apiGroups: ["networking.k8s.io"]
  resources: ["networkpolicies"]
  verbs: ["get","list","create","update","patch","delete"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: haze-worker-binding
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: haze-worker-role
subjects:
- kind: ServiceAccount
  name: haze-worker
  namespace: haze-system
EOF
```

### 第 2 步：配置镜像仓库凭证

```bash
# 将仓库登录凭证创建为 K8s Secret（供 MCP Pod 拉取镜像用）
kubectl create secret docker-registry registry-secret \
  --docker-server=registry.yourcompany.com \
  --docker-username=YOUR_USER \
  --docker-password=YOUR_PASSWORD \
  -n haze-runtime
```

> 如果使用云托管仓库（ECR/GCR），按对应云服务商文档配置 IRSA 或 Workload Identity，不需要手动创建 Secret。

### 第 3 步：生产 `.env`

```env
# K8s 认证（in-cluster 使用 Pod 内 ServiceAccount，无需 kubeconfig 文件）
K8S_IN_CLUSTER=true
K8S_NAMESPACE=haze-runtime

# 镜像仓库
REGISTRY_URL=registry.yourcompany.com
REGISTRY_PROJECT=haze-mcp
REGISTRY_PUSH_ENABLED=true

# 数据库
DATABASE_URL=mysql+pymysql://haze:password@db-host:3306/haze?charset=utf8mb4
```

### 第 4 步：部署 Worker 为 K8s Deployment

```yaml
# worker-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: haze-worker
  namespace: haze-system
spec:
  replicas: 2              # 多实例安全：SELECT FOR UPDATE SKIP LOCKED
  selector:
    matchLabels:
      app: haze-worker
  template:
    metadata:
      labels:
        app: haze-worker
    spec:
      serviceAccountName: haze-worker
      containers:
      - name: worker
        image: registry.yourcompany.com/haze/worker:latest
        workingDir: /app/backend
        command: ["python", "-m", "worker.main"]
        envFrom:
        - secretRef:
            name: haze-env       # 将 .env 内容创建为 K8s Secret
        volumeMounts:
        - name: storage
          mountPath: /app/storage
      volumes:
      - name: storage
        persistentVolumeClaim:
          claimName: haze-storage-pvc
```

```bash
kubectl apply -f worker-deployment.yaml
```

### 第 5 步：部署 Gateway 为 K8s Deployment

```yaml
# gateway-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: haze-gateway
  namespace: haze-system
spec:
  replicas: 2
  selector:
    matchLabels:
      app: haze-gateway
  template:
    metadata:
      labels:
        app: haze-gateway
    spec:
      containers:
      - name: gateway
        image: registry.yourcompany.com/haze/gateway:latest
        workingDir: /app/backend
        command: ["python", "-m", "gateway.main"]
        ports:
        - containerPort: 8001
        envFrom:
        - secretRef:
            name: haze-env
---
apiVersion: v1
kind: Service
metadata:
  name: haze-gateway
  namespace: haze-system
spec:
  selector:
    app: haze-gateway
  ports:
  - port: 8001
    targetPort: 8001
  type: LoadBalancer   # 或 NodePort，根据云平台选择
```

```bash
kubectl apply -f gateway-deployment.yaml
```

### 生产环境下的数据流

```
外部调用方
  │
  ▼
Gateway Service（LoadBalancer/Ingress）
  │  target_url = http://mcp-xxx.haze-runtime.svc.cluster.local:8000/mcp
  │                ↑ 集群内 DNS，ClusterIP Service，Gateway Pod 可直连
  ▼
MCP Server Pod（haze-runtime Namespace）
```

> 生产环境 Service 类型为 **ClusterIP**（代码根据 `K8S_IN_CLUSTER=true` 自动选择），不对外暴露端口，Gateway Pod 通过集群 DNS 内网访问，更安全。

---

## 三、两种环境对比总结

```
本地开发                          生产
─────────────────────────────────────────────────────────
Worker/Gateway 跑在宿主机进程     Worker/Gateway 跑在 K8s Pod
K8S_IN_CLUSTER=false             K8S_IN_CLUSTER=true
Service 类型：NodePort            Service 类型：ClusterIP
target_url：localhost:31234       target_url：svc.cluster.local
Registry：host.docker.internal    Registry：私有仓库
认证：~/.kube/config              认证：Pod ServiceAccount（自动）
```

迁移到生产只需：
1. 修改 `.env` 中 `K8S_IN_CLUSTER=true` 和 `REGISTRY_URL`
2. Worker/Gateway 打包成镜像，用 K8s Deployment 运行
3. 其余代码**无需任何改动**
