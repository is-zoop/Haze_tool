# Function Register

后端已实现功能注册表，按 AGENTS.md 规范维护。每次后端新增/修改必须在此登记或更新对应条目。

---

## [001] MCP Runtime 数据模型

- **状态**：added
- **模块**：`app/modules/mcp_runtime`
- **新增表**：
  - `mcp_deploy_tasks` — 部署任务表，Backend 创建、Deploy Worker 消费
  - `mcp_deployments` — 运行实例表，记录 K8s 部署状态与访问地址
  - `mcp_gateway_routes` — Gateway 路由表，asset_code → 内部服务地址映射
  - `mcp_call_logs` — 调用日志表，Gateway 写入，只追加不更新
- **新增文件**：
  - `backend/app/modules/mcp_runtime/__init__.py`
  - `backend/app/modules/mcp_runtime/enums.py` — 枚举常量集中定义
  - `backend/app/modules/mcp_runtime/models.py` — SQLAlchemy 模型
  - `backend/alembic/versions/20260625_0005_mcp_runtime.py` — Alembic 迁移
- **修改文件**：
  - `backend/app/db/base.py` — 追加 mcp_runtime models 注册
- **APIs**：暂无（Phase 2 新增 `/api/mcp-runtime/*`）
- **变更摘要**：为 HTTP MCP 托管部署功能新增运行时数据模型骨架，不影响任何现有表和接口
- **对现有功能的影响**：无，只新增表，不修改 capabilities / capability_versions 任何字段
- **验证方式**：`alembic upgrade head` 成功；`python -c "from app.modules.mcp_runtime.models import McpDeployTask; print('OK')"` 成功

---

## [002] MCP Runtime 运行管理接口

- **状态**：added
- **模块**：`app/modules/mcp_runtime`
- **新增文件**：
  - `backend/app/modules/mcp_runtime/schemas.py` — 响应 Schema（McpDeploymentData / McpDeployTaskData / McpCallLogData / McpTaskCreated）
  - `backend/app/modules/mcp_runtime/service.py` — 业务逻辑（list/get/tasks/logs/calls/operate）
  - `backend/app/modules/mcp_runtime/router.py` — 8 条路由
- **修改文件**：
  - `backend/app/main.py` — 注册 mcp_runtime_router
- **APIs**：
  - `GET /api/mcp-runtime/deployments` — 运行实例列表（分页）
  - `GET /api/mcp-runtime/deployments/{id}` — 实例详情
  - `GET /api/mcp-runtime/deployments/{id}/tasks` — 任务历史（分页）
  - `GET /api/mcp-runtime/deployments/{id}/logs` — 最新任务日志（纯文本）
  - `GET /api/mcp-runtime/deployments/{id}/calls` — 调用日志（分页）
  - `POST /api/mcp-runtime/deployments/{id}/start` — 创建 start 任务
  - `POST /api/mcp-runtime/deployments/{id}/stop` — 创建 stop 任务
  - `POST /api/mcp-runtime/deployments/{id}/restart` — 创建 restart 任务
- **权限码**：`mcp_runtime.read`（查询）、`mcp_runtime.operate`（操作）
- **变更摘要**：start/stop/restart 只创建 mcp_deploy_tasks 记录，不直接操作 K8s，由 Deploy Worker 消费
- **对现有功能的影响**：无，/api/developer/* 和 /api/audit/* 均未改动
- **验证方式**：`python -c "from app.modules.mcp_runtime.router import router; print('OK')"` 成功；应用启动不报错

---

## [003] Phase 3：部署服务按钮触发真实部署任务

- **状态**：added
- **模块**：`app/modules/capabilities`
- **修改文件**：
  - `backend/app/modules/capabilities/service.py` — 替换 `deploy_capability` 函数实现
- **变更摘要**：
  - 删除占位逻辑（`capability.status = "deployed"`），改为创建 `mcp_deployments`（deploy_status=pending）和 `mcp_deploy_tasks`（task_type=deploy, status=pending）
  - `capability.status` 保持 `approved` 不变，由 Deploy Worker 在部署成功后推进到 `debug_passed`
  - 重复部署（重试）时，`mcp_deployments` 就地重置 `deploy_status=pending` 并清除 `last_error`
  - 函数内部 import mcp_runtime 模块，避免循环依赖
- **APIs**：`POST /api/developer/capabilities/{id}/deploy`（已有路由，无需新增）
- **对现有功能的影响**：
  - 响应中 `capability.status` 变为始终返回 `approved`（不再返回 `deployed`），前端需通过 `/api/mcp-runtime/deployments` 轮询 `deploy_status` 展示进度
- **验证方式**：
  1. `python -c "from app.modules.capabilities.service import deploy_capability; print('OK')"` 成功
  2. 对 `approved` 状态 HTTP MCP 调用 `/deploy`，确认 `mcp_deploy_tasks` 和 `mcp_deployments` 各有一条 `pending` 记录，`capability.status` 仍为 `approved`
  3. 非 HTTP MCP 或非 `approved` 状态调用返回 409

---

## [004] Phase 4：Deploy Worker 基础框架

- **状态**：added
- **模块**：`worker`（独立于 `app/`，与 Haze Backend 共享同一数据库）
- **新增文件**：
  - `backend/worker/__init__.py` — 空包标记
  - `backend/worker/config.py` — WorkerSettings（database_url, poll_interval_seconds, task_lock_timeout_seconds），复用主 backend .env
  - `backend/worker/main.py` — Worker 主循环 + 任务分发 + mock handlers
- **启动方式**：在 `backend/` 目录下执行 `python -m worker.main`
- **APIs**：无，Worker 是独立进程，不暴露 HTTP 接口
- **变更摘要**：
  - 用 `SELECT FOR UPDATE SKIP LOCKED` 抢占 pending 任务，原子标记为 running，支持多 Worker 并发
  - mock handlers 覆盖 deploy / redeploy / start / stop / restart 五种任务类型
  - deploy 成功后：`mcp_deployments.deploy_status=running`, `capabilities.status=debug_passed`
  - 失败时：rollback handler 变更，重新加载对象，回写 failed 状态
  - 无 pending 任务时 sleep poll_interval_seconds，有任务时立即消费下一条
  - task_lock_timeout_seconds 预留在配置中，stuck 任务恢复机制留待 Phase 5
- **对现有功能的影响**：无，仅新增文件，不修改任何现有 Backend 路由/Service/模型
- **验证方式**：
  1. `python -c "from worker.main import run_worker; print('OK')"` 成功（在 backend/ 目录）
  2. 对 `approved` HTTP MCP 能力点击部署后，启动 Worker，确认：
     - `mcp_deploy_tasks.task_status` = success
     - `mcp_deployments.deploy_status` = running
     - `capabilities.status` = debug_passed
  3. 同时启动两个 Worker 实例，同一 pending 任务只被消费一次
  4. 无 pending 任务时 Worker 每 5 秒轮询一次，日志正常，不报错

---

## [005] Phase 5：KubernetesRuntimeProvider（含安全配置）

- **状态**：added
- **模块**：`worker`（独立于 `app/`）
- **新增文件**：
  - `backend/worker/runtime_provider.py` — `RuntimeProvider` Protocol 抽象接口
  - `backend/worker/kubernetes_provider.py` — `KubernetesRuntimeProvider` 实现
- **修改文件**：
  - `backend/requirements.txt` — 追加 `kubernetes>=29,<32`
  - `backend/worker/config.py` — 追加 K8s 连接/资源/超时配置字段
  - `backend/worker/main.py` — mock handlers 全部替换为 provider 调用
- **变更摘要**：
  - deploy: 创建 K8s Deployment（含 Pod securityContext + 资源限制）+ Service + NetworkPolicy，等待 Pod Ready 后推进 `debug_passed`
  - 安全配置：`runAsNonRoot=true`, `allowPrivilegeEscalation=false`, `readOnlyRootFilesystem=true`, `capabilities.drop=ALL`, `automountServiceAccountToken=false`
  - NetworkPolicy ingress 只允许 `haze-system` Namespace；egress 允许 DNS + 外部 HTTPS，禁止内部 RFC 1918 网段
  - start/stop/restart 通过 patch Deployment replicas 或更新 annotation 实现
  - image_url 为空时使用 `mcp_placeholder_image`（默认 `node:20-slim`）占位，Pod 不一定 Ready，deploy 任务超时后置 failed
  - 全端到端（Pod Running → debug_passed）留到 Phase 6 镜像构建完成后测试
- **APIs**：无
- **对现有功能的影响**：无，仅修改 worker/ 模块，不触碰 Backend app/ 路由
- **验证方式**：
  1. `python -c "from worker.kubernetes_provider import KubernetesRuntimeProvider; print('OK')"` 成功
  2. K8s 集群可达时：deploy 任务后 `haze-runtime` Namespace 出现 Deployment/Service/NetworkPolicy，securityContext 符合规范
  3. stop 任务后 Deployment replicas 变为 0；start 后变为 1；restart 后 Pod annotation 更新
  4. K8s 不可达时 Worker 任务 fail 并记录 error_message，进程不崩溃

---

## [006] Phase 6：镜像构建与 mcp.yaml 校验

- **状态**：added
- **模块**：`worker`
- **新增文件**：
  - `backend/worker/image_builder.py` — `McpBuildError` + `load_mcp_config` + `validate_mcp_config` + `generate_dockerfile` + `build_and_push` + `build_image`
- **修改文件**：
  - `backend/worker/config.py` — 追加 `registry_url`, `registry_project`, `docker_build_timeout_seconds`
  - `backend/worker/main.py` — `_handle_deploy` 接入镜像构建流程，新增 `CapabilityVersion`/`resolve_stored_file`/`build_image` import
- **变更摘要**：
  - deploy 阶段 1（building）：从 `CapabilityVersion.snapshot_json.extension_json.package.path` 获取 ZIP 绝对路径，解压 → 读取 mcp.yaml（fallback mcp.json）→ 校验必填字段 + 安全限制 → 动态生成 Dockerfile → docker build + push → 写入 `dep.image_url`
  - deploy 阶段 2（deploying）：沿用 Phase 5 的 KubernetesRuntimeProvider，此时 `dep.image_url` 已是真实镜像
  - 临时目录由 `tempfile.TemporaryDirectory` 自动清理
  - 重试时若 `dep.image_url` 已有非 mock 值，跳过构建直接进入 K8s 部署
- **安全校验**：禁止 ZIP 包含自定义 Dockerfile；禁止 `secret: true`；只允许 runtime: python / node
- **APIs**：无
- **对现有功能的影响**：无，仅修改 worker/ 模块
- **验证方式**：
  1. `python -c "from worker.image_builder import build_image; print('OK')"` 成功
  2. 缺 mcp.yaml 的 ZIP → task.error_message 含 "缺少 mcp.yaml"
  3. mcp.yaml 含 `secret: true` → error_message 含 "禁止使用 secret"
  4. ZIP 含 Dockerfile → error_message 含 "不允许包含自定义 Dockerfile"
  5. 合法 ZIP → docker build + push 成功 → dep.image_url 写入 → Pod Running → capability.status=debug_passed

---

## [007] Phase 7：MCP Gateway 服务

- **状态**：added
- **模块**：`gateway`（独立于 `app/` 和 `worker/`，共享同一数据库）
- **新增文件**：
  - `backend/gateway/__init__.py` — 空包标记
  - `backend/gateway/main.py` — GatewaySettings + FastAPI app + 代理路由 + 调用日志
- **启动方式**：在 `backend/` 目录下执行 `python -m gateway.main`（默认端口 8001）
- **APIs**：
  - `POST /assets/{asset_code}/mcp` — 校验路由/部署/发布状态，代理到 K8s 内部服务，写入 mcp_call_logs
  - `GET  /assets/{asset_code}/mcp` — 405（保留给未来 SSE）
- **变更摘要**：
  - 路由查询：mcp_gateway_routes WHERE asset_code = ?（enabled / running / published 三重校验）
  - 代理：httpx.AsyncClient 异步转发，透传 Content-Type / X-Mcp-* / Authorization
  - 日志：每次请求（含校验失败）写入 mcp_call_logs，user_id 第一版为 null
  - DB 操作为 sync SQLAlchemy，Phase 7 可接受；Phase 9 高流量后可改 AsyncSession
- **对现有功能的影响**：无，不修改任何 Backend app/ 路由或 worker/
- **验证方式**：
  1. `python -c "from gateway.main import app; print('OK')"` 成功（在 backend/ 目录）
  2. `python -m gateway.main` → 监听 8001 端口，无报错
  3. 手动插入 mcp_gateway_routes 路由记录后：
     - `curl -X POST http://localhost:8001/assets/{code}/mcp -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","method":"tools/list","id":1}'` → 代理成功，mcp_call_logs 入库
     - GET 请求返回 405
     - enabled=False → 503；deploy_status != running → 503；capability.status != published → 403

---

## [008] Phase 8：Deploy Worker 与 Gateway 路由联动

- **状态**：added
- **模块**：`worker`
- **修改文件**：
  - `backend/worker/main.py` — 新增 `_sync_gateway_route` 辅助函数，在 deploy/stop/start 三个 handler 中调用
- **变更摘要**：
  - `_sync_gateway_route(db, dep, enabled)` — 按 `deployment_id` 查询 mcp_gateway_routes，不存在则创建，已存在则就地更新 `target_url` 和 `enabled`
  - deploy 成功（Pod Ready + debug_passed）→ 创建路由 `enabled=True`，同步写 `dep.gateway_route` 和 `dep.public_url`
  - stop 成功 → `enabled=False`（Gateway 立刻返回 503）
  - start 成功 → `enabled=True`（Gateway 恢复转发）
  - restart handler 不变（Pod 重启期间 K8s Service 仍可路由）
- **Gateway 路由格式**：`/assets/{asset_code}/mcp`，asset_code = `dep.deployment_name.removeprefix("mcp-")`
- **APIs**：无
- **对现有功能的影响**：无，仅在 worker/ 内部添加，不修改 Backend app/ 路由
- **验证方式**：
  1. `python -c "from worker.main import run_worker; print('OK')"` 成功
  2. deploy 任务成功后：mcp_gateway_routes 有 enabled=True 记录；dep.gateway_route 和 dep.public_url 已写入
  3. stop 任务后 enabled=False → Gateway 返回 503；start 任务后 enabled=True → Gateway 恢复转发

---

## [009] MCP Runtime 权限注册修复

- **状态**：fixed
- **模块**：`app/core/rbac`
- **APIs**：`GET /api/mcp-runtime/deployments`, `GET /api/mcp-runtime/deployments/{id}/tasks`, `GET /api/mcp-runtime/deployments/{id}/logs`
- **表**：`permissions`, `role_permissions`（通过 bootstrap 同步）
- **主要文件**：`backend/app/core/rbac.py`, `backend/function_register.md`
- **变更摘要**：补充 `mcp_runtime.read` / `mcp_runtime.operate` 权限定义，并为 `DEVELOPER` 角色加入 `mcp_runtime.read`，使开发者触发部署后可查看自己的部署进度、任务和日志。
- **对现有功能的影响**：不改变部署执行流程；`ADMIN` / `SYSTEM_ADMIN` 在 bootstrap 后获得 MCP Runtime 读写权限，`DEVELOPER` 获得只读进度查询权限。
- **验证方式**：`python -m py_compile app/core/rbac.py` 成功；前端部署进度弹窗不再因缺少 `mcp_runtime.read` 权限失败（需运行 bootstrap 同步权限）。
