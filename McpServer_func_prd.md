# Haze MCP 托管部署（K8s 版本，基于现有后端增量开发）

## 1. 背景

Haze 当前已经具备：

* 账号登录与 RBAC；
* 成员管理；
* Skill / MCP 共用能力表；
* 能力版本快照表；
* 开发者中心能力注册、编辑、发布、下线、删除；
* 图标与 ZIP 包上传解析；
* MCP HTTP / STDIO 测试运行；
* 审核中心；
* 能力市场与收藏。

本次不重复开发以上能力，只在现有能力资产模型基础上，新增 MCP 托管部署、MCP Gateway、K8s Sandbox Runtime 和运行监控能力。

## 2. 总体目标

当用户提交 HTTP MCP 能力（平台托管部署模式）后，完整流程如下：

1. 用户在开发者中心提交 MCP 能力（transport=HTTP）；
2. 用户提交审核，状态变为 `reviewing`；
3. 管理员审核通过，状态变为 `approved`；
4. Haze Backend 自动创建 deploy 任务（type=mcp + transport=HTTP 时触发）；
5. Deploy Worker 消费部署任务，构建镜像并创建 K8s 资源；
6. 部署成功后状态自动变为 `debug_passed`（表示部署+健康检查通过）；
7. 用户在开发者中心手动点击"发布"，状态变为 `published`；
8. MCP Gateway 生成统一访问地址（public_url）；
9. 外部 AI Agent / MCP Client 通过 Gateway 调用 MCP Server；
10. Haze 前端可以查看 MCP Server 状态、启动、停止、重启、日志和调用记录。

## 3. 非目标

第一版不做：

1. 不重建 capabilities 表；
2. 不重建 capability_versions 表；
3. 不重做能力注册、编辑、上传、版本、审核、收藏；
4. 不做 MCP Tool 明细表；
5. 不做复杂多租户权限授权表；
6. 不做自动扩缩容；
7. 不做灰度发布；
8. 不做蓝绿发布；
9. 不做复杂 Prometheus 图表；
10. 不允许前端直接访问 K8s；
11. 不允许 Haze Backend 直接操作 K8s；
12. 不允许用户提交任意 Dockerfile 直接执行；
13. 不允许 MCP 容器访问 Haze DB / Redis / Backend；
14. **不做 external HTTP MCP 模式**（HTTP MCP 第一版只支持平台托管）；
15. **不做 Secret 环境变量注入**（mcp.yaml 中不支持 secret: true，后续版本补充）；
16. **不做 Gateway 用户身份校验**（user_id 第一版留空，后续通过 API Key 机制补充）。

## 4. 当前已有能力与本次处理方式

### 4.1 已有：capabilities

当前已有能力主表。

本次不重复创建。

只允许小范围补充字段，优先使用 extension_json 存放 MCP 扩展配置。

推荐 extension_json.config 结构（HTTP 托管模式）：

```json
{
  "transport": "HTTP",
  "runtime": "python",
  "port": 8000,
  "mcpEndpoint": "/mcp",
  "healthCheck": "/health",
  "startCommand": "python -m src.server"
}
```

说明：

* transport = HTTP / STDIO；
* HTTP 第一版只支持平台托管（managed），不做 external 模式；
* STDIO 沿用现有测试流程，不涉及 K8s 部署；
* startCommand 从 mcp.yaml 读取，存入 extension_json 供后续使用；
* port / mcpEndpoint / healthCheck 均来自 mcp.yaml。

### 4.2 已有：capability_versions

当前已有版本表和 snapshot_json。

本次不重复创建。

部署任务应引用 capability_versions.id。

构建镜像时优先从版本快照里的 package 信息读取源码包路径。

### 4.3 已有：上传与 MCP 测试

当前已有 ZIP 上传解析和 MCP HTTP / STDIO 测试。

本次不重做。

HTTP 托管模式中需补充：

* 对 mcp.yaml 的存在性校验；
* 对 runtime / start_command / port / mcp_endpoint / health_check 字段完整性校验；
* 对不安全配置的拦截（禁止 host 网络、禁止 privileged 标记等）。

### 4.4 已有：审核中心

当前审核通过后状态变为 `approved`（当前系统状态机）。

本次不绕过审核。

MCP 托管部署触发点：

```text
审核通过后 status = approved
```

如果能力满足：

```text
type = mcp
transport = HTTP
```

则在 approved 之后立即创建 deploy task，状态机继续：

```text
approved → [Deploy Worker 部署] → debug_passed
```

### 4.5 已有：能力市场与收藏

当前能力市场只展示 status=published 的能力。

本次不改能力市场主逻辑。

如果 MCP 托管部署失败，能力停留在 `approved` 状态（不自动进入 debug_passed），开发者中心显示部署失败原因；用户修复后可手动触发重新部署。

## 5. 新增架构角色

### 5.1 Haze Backend

现有服务，继续作为控制面。

职责：

1. 保存能力信息；
2. 维护版本快照；
3. 处理审核通过后的部署任务创建；
4. 提供部署实例查询接口；
5. 提供启动 / 停止 / 重启接口；
6. 提供调用日志和部署日志查询接口；
7. 不直接操作 K8s；
8. 不直接执行用户代码。

### 5.2 Deploy Worker

新增独立服务。

职责：

1. 轮询消费 mcp_deploy_tasks（pending 状态）；
2. 使用数据库行锁（SELECT FOR UPDATE SKIP LOCKED）防止多实例重复消费同一任务；
3. 读取 capability_versions.snapshot_json；
4. 解析已上传 ZIP 包；
5. 校验 mcp.yaml；
6. 构建 MCP Server 镜像；
7. 推送镜像到 Registry；
8. 创建 K8s Deployment / Service / ConfigMap / NetworkPolicy；
9. 等待 Pod Ready；
10. 执行健康检查；
11. 创建或更新 Gateway 路由；
12. 回写任务状态和部署状态；
13. 部署成功时将 capability 状态推进为 `debug_passed`。

### 5.3 MCP Gateway

新增独立服务。

职责：

1. 提供统一 MCP 入口；
2. 根据 asset_code 路由到对应 MCP Server；
3. 校验能力状态（必须为 published）；
4. 校验部署状态（必须为 running）；
5. 透传 MCP 相关 Header；
6. 支持 HTTP POST；
7. 预留 GET / SSE；
8. 记录调用日志（user_id 第一版为 null）；
9. 做基础限流和超时控制。

### 5.4 Sandbox Runtime

不是固定服务。

它是 K8s 中动态创建的一组 MCP Server 资源。

每个托管 MCP 能力对应：

```text
Deployment
Service
ConfigMap
NetworkPolicy
```

## 6. 新增数据库表

### 6.1 mcp_deploy_tasks

用途：部署任务表。

不替代 capability_versions。

字段建议：

```text
id
capability_id
version_id
task_type
task_status
runtime_provider
logs
error_message
created_by
created_at
updated_at
started_at
finished_at
```

枚举：

```text
task_type:
deploy / start / stop / restart / redeploy / rollback

task_status:
pending / running / success / failed

runtime_provider:
kubernetes
```

说明：

* Haze Backend 只创建任务；
* Deploy Worker 消费任务；
* 每次部署、启动、停止、重启都生成任务；
* logs 可以先用 JSON 或 Text，第一版保持简单；
* **并发控制**：Worker 查询 pending 任务时使用 `SELECT FOR UPDATE SKIP LOCKED`，保证多 Worker 实例同时运行时每个任务只被一个 Worker 处理。

### 6.2 mcp_deployments

用途：MCP 运行实例表。

字段建议：

```text
id
capability_id
version_id
deployment_name
namespace
runtime_provider
deploy_status
desired_status
actual_status
image_url
internal_service_name
internal_url
public_url
gateway_route
replicas
ready_replicas
restart_count
health_status
last_health_check_at
last_error
created_at
updated_at
started_at
stopped_at
```

枚举：

```text
deploy_status:
pending / building / deploying / running / failed / stopped

desired_status:
running / stopped

actual_status:
pending / running / failed / stopped

health_status:
unknown / healthy / unhealthy
```

说明：

* deployment 是运行实例，不是能力主数据；
* 一个 capability 可以有多个历史 deployment，但第一版只维护当前 active deployment；
* public_url 格式：`https://gateway.haze.io/assets/{code}/mcp`；
* internal_url 是 K8s Service 内部地址：`http://mcp-{code}.haze-runtime.svc.cluster.local:{port}{mcpEndpoint}`。

### 6.3 mcp_gateway_routes

用途：Gateway 路由表。

字段建议：

```text
id
capability_id
deployment_id
asset_code
route_path
target_url
rate_limit
enabled
created_at
updated_at
```

示例：

```text
route_path = /assets/sales-query/mcp
target_url = http://mcp-sales-query.haze-runtime.svc.cluster.local:8000/mcp
```

说明：

* 第一版不做 token 校验（auth_required 字段暂不引入）；
* 后续引入 API Key 机制时再扩展。

### 6.4 mcp_call_logs

用途：Gateway 调用日志表。

字段建议：

```text
id
capability_id
deployment_id
asset_code
request_id
user_id
client_ip
method
tool_name
status_code
success
duration_ms
error_message
created_at
```

说明：

* 由 MCP Gateway 写入；
* **user_id 第一版为 null**，不做身份校验；后续版本通过 API Key → user 映射补充（选项 C）；
* tool_name 第一版可以为空，后续解析 JSON-RPC tools/call 参数填充。

## 7. 不新增的表

本次不要新增：

```text
capabilities
capability_versions
capability_favorites
capability_audit_records
mcp_tools
capability_permissions
```

这些要么已经存在，要么不是当前阶段目标。

## 8. 新增后端模块建议

在 backend/app/modules 下新增：

```text
mcp_runtime/
  models.py
  schemas.py
  router.py
  service.py
  enums.py
```

职责：

* 部署实例查询；
* 部署任务查询；
* 启动、停止、重启；
* 日志和调用记录查询；
* 不放 K8s 具体操作代码。

## 9. Deploy Worker 目录建议

新增独立目录：

```text
backend/worker/
  main.py
  config.py          ← 含 POLL_INTERVAL_SECONDS 等配置项
  task_consumer.py
  handlers.py
  runtime_provider.py
  kubernetes_provider.py
  image_builder.py
```

config.py 关键配置项：

```python
POLL_INTERVAL_SECONDS: int = 5       # 没有待处理任务时的轮询间隔（秒）
TASK_LOCK_TIMEOUT_SECONDS: int = 300 # 任务锁定超时，防止 Worker 崩溃后任务永久卡住
MAX_CONCURRENT_TASKS: int = 3        # 单 Worker 最大并发任务数
REGISTRY_URL: str = ""               # 镜像仓库地址
REGISTRY_PROJECT: str = "haze-mcp"  # 镜像仓库项目名
K8S_NAMESPACE: str = "haze-runtime" # MCP Server 运行的 Namespace
```

说明：

* 第一版可与 backend 共用数据库 models；
* Worker 独立启动，不挂到 FastAPI 主应用；
* Worker 轮询逻辑：查询 pending 任务 → SELECT FOR UPDATE SKIP LOCKED → 改 running → 处理 → 改 success/failed → sleep(POLL_INTERVAL_SECONDS)；
* 开发环境可将 POLL_INTERVAL_SECONDS 设为 1，生产设为 5-10。

## 10. MCP Gateway 目录建议

新增独立目录：

```text
backend/gateway/
  main.py
  config.py
  router.py
  proxy.py
  logging.py
```

说明：

* Gateway 是独立 FastAPI 服务；
* 不复用 Haze Backend 的业务 router；
* 只做 MCP 请求代理；
* 查询 mcp_gateway_routes 和 mcp_deployments；
* 写入 mcp_call_logs（user_id 留 null）；
* 第一版不做 auth.py（无 token 校验），后续补充。

## 11. API 设计

### 11.1 现有接口保持不变

不得破坏：

```text
GET /api/developer/capabilities
POST /api/developer/capabilities
PATCH /api/developer/capabilities/{id}
POST /api/developer/capabilities/{id}/publish
POST /api/developer/capabilities/{id}/offline
GET /api/developer/capabilities/{id}/test-run
GET /api/audit/capabilities
POST /api/audit/capabilities/{id}/review
GET /api/marketplace/capabilities
```

### 11.2 新增运行管理接口

新增前缀：

```text
/api/mcp-runtime
```

接口：

```text
GET  /api/mcp-runtime/deployments
GET  /api/mcp-runtime/deployments/{deployment_id}
GET  /api/mcp-runtime/deployments/{deployment_id}/tasks
GET  /api/mcp-runtime/deployments/{deployment_id}/logs
GET  /api/mcp-runtime/deployments/{deployment_id}/calls
POST /api/mcp-runtime/deployments/{deployment_id}/start
POST /api/mcp-runtime/deployments/{deployment_id}/stop
POST /api/mcp-runtime/deployments/{deployment_id}/restart
```

说明：

* start / stop / restart 只创建任务；
* 不直接操作 K8s；
* 返回 task_id；
* 前端轮询任务状态。

### 11.3 Gateway 对外接口

Gateway 服务提供：

```text
POST /assets/{asset_code}/mcp
GET  /assets/{asset_code}/mcp   （预留）
```

public_url 格式：

```text
https://gateway.haze.io/assets/{asset_code}/mcp
```

第一版必须实现 POST，GET 预留路由但返回 405。

## 12. 状态流转与部署联动

### 12.1 现有状态机（保持不变）

```text
draft → reviewing → approved → debug_passed → published → offline
                 ↘ rejected
```

各类型能力允许的状态路径：

| 能力类型 | 流程 |
|---|---|
| Skill | draft → reviewing → approved → published |
| STDIO MCP | draft → reviewing → approved → debug_passed（Docker 测试） → published |
| HTTP MCP（托管） | draft → reviewing → approved → debug_passed（K8s 部署） → published |

### 12.2 HTTP MCP 托管模式详细流转

```
用户提交审核
  ↓
POST /api/developer/capabilities/{id}/publish
status = reviewing

管理员审核通过
  ↓
POST /api/audit/capabilities/{id}/review  {"action": "approved"}
status = approved
→ 同时自动创建 mcp_deploy_tasks（task_type=deploy, status=pending）

Deploy Worker 消费任务
  ↓
task_status = running
  ↓
读取 capability + version snapshot
  ↓
解压 ZIP，校验 mcp.yaml
  ↓
构建镜像，推送 Registry
  ↓
创建 K8s 资源（Deployment/Service/ConfigMap/NetworkPolicy）
  ↓
等待 Pod Ready + 健康检查
  ↓
写入 mcp_deployments（deploy_status=running）
写入 mcp_gateway_routes（enabled=true）
task_status = success
  ↓
capability.status = debug_passed   ← Worker 回写

用户手动发布
  ↓
POST /api/developer/capabilities/{id}/publish
status = published
```

### 12.3 部署失败处理

```text
Deploy Worker 失败
  ↓
task_status = failed
last_error = "失败原因"
deploy_status = failed
capability.status 保持 approved（不推进）

开发者中心显示部署失败原因
用户修复代码后重新上传 ZIP → 触发 redeploy task
```

### 12.4 触发条件精确定义

审核通过后，满足以下全部条件才创建 deploy task：

```python
capability.type == "mcp"
config.get("transport") == "HTTP"
```

不满足时（Skill / STDIO MCP）：正常走 approved，不创建部署任务。

## 13. K8s 资源设计

### 13.1 Namespace

```text
haze-system   # Haze Backend / Deploy Worker / MCP Gateway / DB / Redis
haze-runtime  # 所有 MCP Server Pod
```

### 13.2 资源命名规则

```text
Deployment:  mcp-{capability.code}
Service:     mcp-{capability.code}
ConfigMap:   mcp-{capability.code}-config
```

### 13.3 内部地址

```text
http://mcp-{code}.haze-runtime.svc.cluster.local:{port}{mcpEndpoint}
```

### 13.4 安全配置（随 K8s 资源创建时同步加入，不推迟到安全加固阶段）

Pod 安全上下文：

```yaml
securityContext:
  runAsNonRoot: true
  allowPrivilegeEscalation: false
  capabilities:
    drop: ["ALL"]
  privileged: false
hostNetwork: false
hostPID: false
hostIPC: false
```

资源限制：

```yaml
resources:
  requests:
    cpu: 100m
    memory: 128Mi
  limits:
    cpu: 500m
    memory: 512Mi
```

NetworkPolicy 规则：

```text
只允许 Gateway Pod 访问 MCP Pod（ingress）
禁止 MCP Pod 访问 Haze Backend
禁止 MCP Pod 访问 Haze DB
禁止 MCP Pod 访问 Redis
禁止 MCP Pod 访问其他 MCP Pod
```

## 14. MCP 包结构要求

### 14.1 统一配置文件：mcp.yaml

**第一版将 mcp.json（STDIO 测试配置）与 haze.yaml（托管部署配置）统一为 mcp.yaml**，ZIP 包中只需包含一个配置文件，平台根据 transport 字段决定处理逻辑。

STDIO 模式示例：

```yaml
transport: STDIO
command: python
args: mcp_demo_server.py
```

HTTP 托管模式示例：

```yaml
transport: HTTP
runtime: python
start_command: python -m src.server
port: 8000
mcp_endpoint: /mcp
health_check: /health
env:
  - name: API_BASE_URL
    required: false
```

字段说明：

| 字段 | STDIO | HTTP 托管 | 说明 |
|---|---|---|---|
| transport | 必填 | 必填 | STDIO / HTTP |
| command | 必填 | - | 进程启动命令，如 python |
| args | 必填 | - | 启动参数，如 server.py |
| runtime | - | 必填 | python / node |
| start_command | - | 必填 | 容器内启动命令 |
| port | - | 必填 | MCP Server 监听端口 |
| mcp_endpoint | - | 必填 | MCP 接口路径，如 /mcp |
| health_check | - | 必填 | 健康检查路径，如 /health |
| env | - | 可选 | 非 secret 环境变量列表 |

**不支持 `secret: true`**：第一版 env 列表中不允许声明 secret 字段，平台不做 Secret 注入。

### 14.2 ZIP 包必须包含

```text
mcp.yaml          ← 统一配置文件（替代原 mcp.json）
README.md
源码文件
依赖文件（package.json 或 requirements.txt）
```

STDIO 模式可额外包含：

```text
mcp-test.json     ← 测试用例（可选）
```

### 14.3 现有 mcp.json 兼容

现有已上传的 STDIO MCP 包中的 `mcp.json` 继续有效，后端解析时优先读取 `mcp.yaml`，找不到时 fallback 到 `mcp.json`。新提交的包统一要求 `mcp.yaml`。

### 14.4 第一版支持的 runtime

```text
python   → python:3.12-slim
node     → node:20-slim
```

## 15. 前端页面设计

新增页面：

```text
MCP 运行监控中心
路径：/developer/mcp-runtime
```

页面结构：

```text
Tab 1：运行实例
Tab 2：调用监控
Tab 3：部署记录
```

### 15.1 运行实例 Tab

展示字段：

```text
能力名称 / 能力编码 / 版本 / 部署状态 / 运行状态 / 健康状态
副本数 / 重启次数 / 访问地址（public_url） / 最近更新时间 / 操作
```

操作按钮：

```text
启动 / 停止 / 重启 / 复制访问地址 / 查看日志
```

### 15.2 调用监控 Tab

第一版展示：

```text
今日调用次数 / 成功率 / 平均耗时 / 错误次数
最近调用记录表（不含 user_id 列）
```

不做复杂趋势图。

### 15.3 部署记录 Tab

展示：

```text
任务类型 / 任务状态 / 版本 / 开始时间 / 结束时间 / 失败原因 / 部署日志
```

### 15.4 前端要求

1. 使用现有 shadcn-ui；
2. 遵循 index.css 和现有设计 token；
3. 不大幅改动现有 UI；
4. mock 数据放到 src/temp；
5. 空状态只显示提示，不额外添加按钮；
6. 不在页面组件内硬编码大量测试数据。

## 16. 分阶段实施计划

### Phase 1：运行时数据模型与迁移

目标：只新增 MCP Runtime 所需表，不重复已有表。

任务：

1. 新增 mcp_runtime 模块；
2. 新增 mcp_deploy_tasks（含 SELECT FOR UPDATE SKIP LOCKED 支持说明）；
3. 新增 mcp_deployments；
4. 新增 mcp_gateway_routes（无 auth_required 字段）；
5. 新增 mcp_call_logs（user_id 可空）；
6. 新增枚举集中定义；
7. 新增 Alembic 迁移；
8. 更新 app/db/base.py 模型注册；
9. 更新 function_register.md。

验收：

1. Alembic 可升级；
2. 后端启动不报错；
3. 不修改 capabilities / capability_versions 结构；
4. 不修改现有接口 response shape；
5. function_register.md 已登记。

### Phase 2：Backend 运行管理接口

目标：新增 MCP Runtime 查询与操作接口。

任务：

1. 新增 /api/mcp-runtime/deployments 列表；
2. 新增 deployment 详情；
3. 新增 deployment tasks 查询；
4. 新增 deployment logs 查询；
5. 新增 deployment calls 查询；
6. 新增 start / stop / restart 接口（只创建任务）；
7. 添加权限码；
8. 更新 function_register.md。

验收：

1. 能查询部署实例列表；
2. 能创建 start / stop / restart 任务；
3. Backend 不引入 Kubernetes Client；
4. 不影响现有能力注册、审核、市场接口。

### Phase 3：审核通过后自动创建部署任务

目标：托管 MCP 审核通过（status=approved）后自动进入部署流程。

任务：

1. 在审核通过逻辑中（status 变为 approved 时）识别 HTTP MCP；
2. 判断条件：type=mcp、transport=HTTP；
3. 创建 mcp_deploy_tasks（task_type=deploy, status=pending）；
4. 不改变审核接口 response shape；
5. 不影响 Skill / STDIO MCP；
6. 更新 function_register.md。

验收：

1. Skill 审核通过不创建部署任务；
2. STDIO MCP 审核通过不创建部署任务；
3. HTTP MCP 审核通过自动创建 deploy task；
4. 能力状态按现有逻辑正常变为 approved。

### Phase 4：Deploy Worker 基础框架

目标：新增独立 Worker，消费任务，第一版先 mock K8s 操作。

任务：

1. 新增 backend/worker 目录；
2. 新增 config.py（含 POLL_INTERVAL_SECONDS / TASK_LOCK_TIMEOUT_SECONDS 等）；
3. Worker 可读取数据库；
4. 查询 pending task（SELECT FOR UPDATE SKIP LOCKED）；
5. 锁定任务并改 running；
6. 按 task_type 分发 handler；
7. handler 第一版写 mock 成功结果；
8. 失败时记录 error_message；
9. 更新 function_register.md。

验收：

1. Worker 可以独立启动；
2. pending task 可以被消费；
3. 状态可从 pending → running → success / failed；
4. 同一任务不会被两个 Worker 重复消费；
5. 不影响 Haze Backend；
6. 不修改前端。

### Phase 5：KubernetesRuntimeProvider（含安全配置）

目标：让 Worker 可以真实操作 K8s，安全配置随资源创建同步加入。

任务：

1. 增加 kubernetes 依赖；
2. 新增 RuntimeProvider 抽象；
3. 实现 KubernetesRuntimeProvider；
4. 实现 deploy（含 Pod 安全上下文 + 资源限制 + NetworkPolicy）；
5. 实现 start（replicas 改为 1）；
6. 实现 stop（replicas 改为 0）；
7. 实现 restart；
8. 实现 get_status；
9. 实现 get_logs；
10. K8s 逻辑只在 Worker RuntimeProvider 中。

验收：

1. deploy 可创建安全的 MCP Deployment；
2. NetworkPolicy 正确限制 MCP Pod 访问；
3. stop / start / restart 生效；
4. get_status 返回 Pod 状态；
5. get_logs 返回最近日志。

### Phase 6：镜像构建与 mcp.yaml 校验

目标：支持从 ZIP 包构建 MCP Server 镜像。

任务：

1. 从 capability_versions.snapshot_json 读取 package 路径；
2. 解压 ZIP 到临时目录；
3. 读取并校验 mcp.yaml（优先）/ mcp.json（fallback）；
4. 校验 runtime / start_command / port / mcp_endpoint / health_check；
5. 禁止 secret: true 字段（第一版不支持）；
6. 根据 runtime 选择基础镜像，动态生成 Dockerfile；
7. 构建镜像，推送到 Registry；
8. image_url 写入 mcp_deployments；
9. 清理临时目录。

验收：

1. 缺 mcp.yaml 且无 mcp.json 时构建失败并记录原因；
2. mcp.yaml 配置不完整时构建失败；
3. 含 secret: true 时拒绝构建；
4. 构建成功后得到 image_url；
5. 不允许用户自定义 Dockerfile。

### Phase 7：MCP Gateway 服务

目标：新增独立 Gateway，实现统一 MCP 访问入口。

任务：

1. 新增 backend/gateway 目录；
2. 实现 POST /assets/{asset_code}/mcp；
3. 查询 mcp_gateway_routes；
4. 校验 route enabled；
5. 校验 deployment running；
6. 转发请求到 target_url；
7. 透传 MCP Header；
8. 写入 mcp_call_logs（user_id=null）；
9. 增加基础超时；
10. 预留 GET 路由（返回 405）。

验收：

1. 外部请求可经 Gateway 转发到 MCP Server；
2. Gateway 不暴露内部 Service 地址；
3. 调用日志可写入（user_id 为 null）；
4. deployment stopped 时请求返回 503；
5. capability 未 published 时请求返回 403。

### Phase 8：Deploy Worker 与 Gateway 路由联动

目标：部署成功后自动创建 Gateway 路由，能力状态推进为 debug_passed。

任务：

1. deploy 成功后生成 internal_url；
2. 创建或更新 mcp_deployments（deploy_status=running）；
3. 创建或更新 mcp_gateway_routes（enabled=true）；
4. 生成 public_url（格式：https://gateway.haze.io/assets/{code}/mcp）；
5. 将 capability.status 推进为 debug_passed；
6. 健康检查失败时 deploy_status=failed，capability.status 保持 approved；
7. stop 时 mcp_gateway_routes.enabled=false；
8. start 后 mcp_gateway_routes.enabled=true。

验收：

1. 审核通过 → 部署成功 → capability 自动变为 debug_passed；
2. 用户可以点击"发布"将状态变为 published；
3. public_url 可访问；
4. stop 后访问被拦截（503）；
5. start 后访问恢复；
6. 部署失败时 capability 停留在 approved，原因可查。

### Phase 9：前端 MCP 运行监控中心

目标：新增前端页面展示 MCP 运行实例和操作。

任务：

1. 新增 /developer/mcp-runtime 页面；
2. 接入 /api/mcp-runtime/deployments；
3. 展示运行实例列表；
4. 展示部署记录；
5. 展示调用记录（不含 user_id 列）；
6. 实现启动 / 停止 / 重启；
7. 实现复制访问地址（public_url）；
8. 空状态只展示提示；
9. mock 数据放到 src/temp；
10. 不大幅调整现有 UI 风格。

验收：

1. 页面风格与 Haze 保持一致；
2. 表格字段清晰；
3. 按钮调用真实接口；
4. 无硬编码大量 mock；
5. 不影响开发者中心现有能力列表。

### Phase 10：安全加固与 Gateway API Key（未来版本）

目标：补充 Gateway 身份校验和增强运行隔离（不在第一版实施）。

待做事项（留作记录）：

1. Gateway 引入 API Key 机制（选项 C）：用户从 Haze 获取 per-user API Key，Gateway 校验 Key → 查出 user_id → 写入 mcp_call_logs；
2. mcp.yaml 支持 secret: true 环境变量，平台通过 K8s Secret 注入；
3. Gateway 增加基础限流（rate_limit 字段启用）；
4. 敏感信息不进入普通日志；
5. MCP Pod 禁止访问 Haze Backend / DB / Redis（已在 Phase 5 的 NetworkPolicy 中处理，此处做回归验证）。
