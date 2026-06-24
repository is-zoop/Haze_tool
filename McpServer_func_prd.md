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

当用户提交 MCP 能力，并选择 HTTP + 平台托管部署后：

1. 用户在开发者中心提交 MCP 能力；
2. 用户点击发布；
3. 现有审核流程通过后，能力状态变为 published；
4. Haze Backend 创建 MCP 部署任务；
5. Deploy Worker 消费部署任务；
6. Deploy Worker 构建镜像并创建 K8s 资源；
7. MCP Server 运行在 K8s Sandbox Runtime；
8. MCP Gateway 生成统一访问地址；
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
13. 不允许 MCP 容器访问 Haze DB / Redis / Backend。

## 4. 当前已有能力与本次处理方式

## 4.1 已有：capabilities

当前已有能力主表。

本次不重复创建。

只允许小范围补充字段，优先使用 extension_json 存放 MCP 扩展配置。

推荐 extension_json.config 结构：

```json
{
  "transport": "HTTP",
  "deployMode": "managed",
  "serverUrl": "",
  "runtime": "python",
  "port": 8000,
  "mcpEndpoint": "/mcp",
  "healthCheck": "/health",
  "startCommand": "python -m src.server"
}
```

说明：

* transport = HTTP / STDIO；
* deployMode = external / managed；
* external 表示用户已有 HTTP MCP 地址，Haze 只做代理和测试；
* managed 表示 Haze 托管部署到 K8s；
* serverUrl 对 external 有效；
* managed 模式发布后由 Gateway 生成 public_url。

## 4.2 已有：capability_versions

当前已有版本表和 snapshot_json。

本次不重复创建。

部署任务应引用 capability_versions.id。

构建镜像时优先从版本快照里的 package 信息读取源码包路径。

## 4.3 已有：上传与 MCP 测试

当前已有 ZIP 上传解析和 MCP HTTP / STDIO 测试。

本次不重做。

只需要在 managed 模式中补充：

* 对 haze.yaml 的校验；
* 对托管部署入口的校验；
* 对健康检查路径的校验；
* 对不安全配置的拦截。

## 4.4 已有：审核中心

当前 publish 接口会进入 reviewing，审核通过后状态变为 published。

本次不绕过审核。

MCP 托管部署触发点建议放在：

```text
审核通过后 status = published
```

也就是审核通过时，如果能力满足：

```text
type = mcp
transport = HTTP
deployMode = managed
```

则创建 deploy task。

## 4.5 已有：能力市场与收藏

当前能力市场只展示 status=published 的能力。

本次不改能力市场主逻辑。

如果 MCP 托管部署失败，能力可以仍然 published，但运行状态显示 failed；市场是否展示由后续产品决定。第一版建议仍展示，但详情页提示“运行异常”。

## 5. 新增架构角色

## 5.1 Haze Backend

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

## 5.2 Deploy Worker

新增独立服务。

职责：

1. 消费 mcp_deploy_tasks；
2. 读取 capability_versions.snapshot_json；
3. 解析已上传 ZIP 包；
4. 校验 haze.yaml；
5. 构建 MCP Server 镜像；
6. 推送镜像到 Registry；
7. 创建 K8s Deployment / Service / ConfigMap / Secret / NetworkPolicy；
8. 等待 Pod Ready；
9. 执行健康检查；
10. 创建或更新 Gateway 路由；
11. 回写任务状态和部署状态。

## 5.3 MCP Gateway

新增独立服务。

职责：

1. 提供统一 MCP 入口；
2. 根据 asset code 路由到对应 MCP Server；
3. 校验能力状态；
4. 校验部署状态；
5. 校验 token；
6. 透传 MCP 相关 Header；
7. 支持 HTTP POST；
8. 预留 GET / SSE；
9. 记录调用日志；
10. 做基础限流和超时控制。

## 5.4 Sandbox Runtime

不是固定服务。

它是 K8s 中动态创建的一组 MCP Server 资源。

每个托管 MCP 能力对应：

```text
Deployment
Service
ConfigMap
Secret
NetworkPolicy
```

## 6. 新增数据库表

## 6.1 mcp_deploy_tasks

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
* logs 可以先用 JSON 或 Text，第一版保持简单。

## 6.2 mcp_deployments

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
* public_url 由 Gateway 地址生成；
* internal_url 是 K8s Service 内部地址。

## 6.3 mcp_gateway_routes

用途：Gateway 路由表。

字段建议：

```text
id
capability_id
deployment_id
asset_code
route_path
target_url
auth_required
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

## 6.4 mcp_call_logs

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
* 第一版 tool_name 可以为空；
* 后续可解析 JSON-RPC method 和 tools/call 参数。

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
  config.py
  task_consumer.py
  handlers.py
  runtime_provider.py
  kubernetes_provider.py
  image_builder.py
```

说明：

* 第一版可与 backend 共用数据库 models；
* Worker 独立启动；
* Worker 不挂到 FastAPI 主应用；
* Worker 可以用轮询 pending task 的方式实现，不强制引入消息队列。

## 10. MCP Gateway 目录建议

新增独立目录：

```text
backend/gateway/
  main.py
  config.py
  router.py
  proxy.py
  auth.py
  logging.py
```

说明：

* Gateway 是独立 FastAPI 服务；
* 不复用 Haze Backend 的业务 router；
* 只做 MCP 请求代理；
* 查询 mcp_gateway_routes 和 mcp_deployments；
* 写入 mcp_call_logs。

## 11. API 设计

## 11.1 现有接口保持不变

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

## 11.2 新增运行管理接口

新增前缀：

```text
/api/mcp-runtime
```

接口：

```text
GET /api/mcp-runtime/deployments
GET /api/mcp-runtime/deployments/{deployment_id}
GET /api/mcp-runtime/deployments/{deployment_id}/tasks
GET /api/mcp-runtime/deployments/{deployment_id}/logs
GET /api/mcp-runtime/deployments/{deployment_id}/calls
POST /api/mcp-runtime/deployments/{deployment_id}/start
POST /api/mcp-runtime/deployments/{deployment_id}/stop
POST /api/mcp-runtime/deployments/{deployment_id}/restart
```

说明：

* start / stop / restart 只创建任务；
* 不直接操作 K8s；
* 返回 task_id；
* 前端轮询任务状态。

## 11.3 Gateway 对外接口

Gateway 服务提供：

```text
POST /assets/{asset_code}/mcp
GET /assets/{asset_code}/mcp
DELETE /assets/{asset_code}/mcp
```

第一版必须实现：

```text
POST /assets/{asset_code}/mcp
```

GET / DELETE 可以先预留。

## 12. 发布与部署联动流程

## 12.1 用户提交发布

沿用现有流程：

```text
Developer Center
  ↓
POST /api/developer/capabilities/{id}/publish
  ↓
status = reviewing
```

## 12.2 审核通过

现有审核通过会：

```text
status = published
```

本次在审核通过逻辑后追加：

```text
if capability.type == "mcp"
and config.transport == "HTTP"
and config.deployMode == "managed":
    create deploy task
```

注意：

* 不影响 Skill；
* 不影响 STDIO MCP；
* 不影响 external HTTP MCP；
* 不要改变审核接口 response shape。

## 12.3 Deploy Worker 执行部署

```text
读取 pending deploy task
  ↓
任务改 running
  ↓
读取 capability + version snapshot
  ↓
读取 ZIP package
  ↓
校验 haze.yaml
  ↓
构建镜像
  ↓
推送镜像
  ↓
创建 K8s 资源
  ↓
等待 Pod Ready
  ↓
健康检查
  ↓
写入 mcp_deployments
  ↓
写入 mcp_gateway_routes
  ↓
任务 success
```

## 13. K8s 资源设计

## 13.1 Namespace

建议：

```text
haze-system
haze-runtime
```

haze-system：

```text
haze-backend
haze-deploy-worker
haze-mcp-gateway
db / redis 可选
```

haze-runtime：

```text
mcp-server-xxx
mcp-server-yyy
```

## 13.2 Deployment 命名

```text
mcp-{capability.code}
```

## 13.3 Service 命名

```text
mcp-{capability.code}
```

## 13.4 内部地址

```text
http://mcp-{code}.haze-runtime.svc.cluster.local:{port}{mcpEndpoint}
```

## 13.5 安全限制

MCP Pod 默认要求：

```text
runAsNonRoot: true
allowPrivilegeEscalation: false
capabilities.drop: ["ALL"]
privileged: false
hostNetwork: false
hostPID: false
hostIPC: false
```

资源限制：

```text
requests.cpu: 100m
requests.memory: 128Mi
limits.cpu: 500m
limits.memory: 512Mi
```

NetworkPolicy 第一版要求：

```text
只允许 Gateway 访问 MCP Pod
禁止 MCP Pod 访问 Haze Backend
禁止 MCP Pod 访问 Haze DB
禁止 MCP Pod 访问 Redis
禁止 MCP Pod 访问其他 MCP Pod
```

## 14. MCP 包结构要求

第一版平台托管部署只支持固定结构。

ZIP 包中必须包含：

```text
haze.yaml
README.md
源码文件
依赖文件
```

haze.yaml 示例：

```yaml
name: sales-query-mcp
runtime: python
start_command: python -m src.server
port: 8000
mcp_endpoint: /mcp
health_check: /health
env:
  - name: API_KEY
    required: true
    secret: true
```

第一版支持 runtime：

```text
python
node
```

如果实现成本高，第一版先只支持 python。

## 15. 前端页面设计

新增页面：

```text
MCP 运行监控中心
```

建议路径：

```text
/developer/mcp-runtime
```

页面结构：

```text
Tab 1：运行实例
Tab 2：调用监控
Tab 3：部署记录
```

## 15.1 运行实例 Tab

字段：

```text
能力名称
能力编码
版本
部署状态
运行状态
健康状态
副本数
重启次数
访问地址
最近更新时间
操作
```

操作：

```text
启动
停止
重启
复制访问地址
查看日志
```

## 15.2 调用监控 Tab

第一版展示：

```text
今日调用次数
成功率
平均耗时
错误次数
最近调用记录表
```

不做复杂趋势图。

## 15.3 部署记录 Tab

展示：

```text
任务类型
任务状态
版本
开始时间
结束时间
失败原因
部署日志
```

## 15.4 前端要求

1. 使用现有 shadcn-ui；
2. 遵循 index.css 和现有设计 token；
3. 不大幅改动现有 UI；
4. mock 数据放到 src/temp；
5. 空状态只显示提示，不额外添加按钮；
6. 不在页面组件内硬编码大量测试数据。

## 16. 分阶段实施计划

## Phase 1：运行时数据模型与迁移

目标：

只新增 MCP Runtime 所需表，不重复已有表。

任务：

1. 新增 mcp_runtime 模块；
2. 新增 mcp_deploy_tasks；
3. 新增 mcp_deployments；
4. 新增 mcp_gateway_routes；
5. 新增 mcp_call_logs；
6. 新增枚举集中定义；
7. 新增 Alembic 迁移；
8. 更新 app/db/base.py 模型注册；
9. 更新 function_register.md。

验收：

1. Alembic 可升级；
2. 后端启动不报错；
3. 不修改 capabilities / capability_versions 结构，除非确实必要；
4. 不修改现有接口 response shape；
5. function_register.md 已登记。

## Phase 2：Backend 运行管理接口

目标：

新增 MCP Runtime 查询与操作接口。

任务：

1. 新增 /api/mcp-runtime/deployments 列表；
2. 新增 deployment 详情；
3. 新增 deployment tasks 查询；
4. 新增 deployment logs 查询；
5. 新增 deployment calls 查询；
6. 新增 start / stop / restart 接口；
7. start / stop / restart 只创建 mcp_deploy_tasks；
8. 添加权限码；
9. 更新 function_register.md。

验收：

1. 能查询部署实例列表；
2. 能创建 start / stop / restart 任务；
3. Backend 不引入 Kubernetes Client；
4. Backend 不直接操作 K8s；
5. 不影响现有能力注册、审核、市场接口。

## Phase 3：审核通过后自动创建部署任务

目标：

托管 MCP 审核通过后自动进入部署流程。

任务：

1. 在审核通过逻辑中识别托管 MCP；
2. 判断条件：type=mcp、transport=HTTP、deployMode=managed；
3. 创建 mcp_deploy_tasks，task_type=deploy；
4. 不改变审核接口 response shape；
5. 不影响 Skill / STDIO / external HTTP；
6. 更新 function_register.md。

验收：

1. Skill 审核通过不创建部署任务；
2. STDIO MCP 审核通过不创建部署任务；
3. external HTTP MCP 审核通过不创建部署任务；
4. managed HTTP MCP 审核通过创建 deploy task；
5. 能力状态仍按现有审核逻辑变为 published。

## Phase 4：Deploy Worker 基础框架

目标：

新增独立 Worker，可以消费任务，但先不真实操作 K8s。

任务：

1. 新增 backend/worker；
2. Worker 可读取数据库；
3. Worker 查询 pending task；
4. Worker 锁定任务并改 running；
5. 按 task_type 分发 handler；
6. handler 第一版可写 mock 成功结果；
7. 失败时记录 error_message；
8. 更新 function_register.md。

验收：

1. Worker 可以独立启动；
2. pending task 可以被消费；
3. 状态可从 pending -> running -> success / failed；
4. 不影响 Haze Backend；
5. 不修改前端。

## Phase 5：KubernetesRuntimeProvider

目标：

让 Worker 可以真实操作 K8s。

任务：

1. 增加 kubernetes 依赖；
2. 新增 RuntimeProvider 抽象；
3. 实现 KubernetesRuntimeProvider；
4. 实现 deploy；
5. 实现 start；
6. 实现 stop；
7. 实现 restart；
8. 实现 get_status；
9. 实现 get_logs；
10. 创建 Deployment / Service / ConfigMap / Secret / NetworkPolicy。

验收：

1. deploy 可创建 MCP Deployment；
2. stop 可将 replicas 改为 0；
3. start 可将 replicas 改为 1；
4. restart 可触发 Pod 重启；
5. get_status 返回 Pod 状态；
6. get_logs 返回最近日志；
7. K8s 逻辑只在 Worker RuntimeProvider 中。

## Phase 6：镜像构建与 haze.yaml 校验

目标：

支持从现有 ZIP 包构建 MCP Server 镜像。

任务：

1. 从 capability_versions.snapshot_json 读取 package 路径；
2. 解压 ZIP 到临时目录；
3. 校验 haze.yaml；
4. 校验 runtime / start_command / port / endpoint；
5. 构建镜像；
6. 推送镜像到 Registry；
7. image_url 写入 mcp_deployments；
8. 清理临时目录。

验收：

1. 缺 haze.yaml 时构建失败并记录原因；
2. 配置不完整时构建失败并记录原因；
3. 构建成功后可以得到 image_url；
4. 不允许使用用户自定义 Dockerfile 直接执行；
5. 临时文件可清理。

## Phase 7：MCP Gateway 服务

目标：

新增独立 Gateway，实现统一 MCP 访问入口。

任务：

1. 新增 backend/gateway；
2. 实现 POST /assets/{asset_code}/mcp；
3. 查询 mcp_gateway_routes；
4. 校验 route enabled；
5. 校验 deployment running；
6. 转发请求到 target_url；
7. 透传 MCP Header；
8. 写入 mcp_call_logs；
9. 增加基础超时；
10. 预留 GET / DELETE / SSE。

验收：

1. 外部请求可以经 Gateway 转发到 MCP Server；
2. Gateway 不暴露内部 Service 地址；
3. 调用日志可写入；
4. Header 可透传；
5. deployment stopped 时请求不可转发。

## Phase 8：Deploy Worker 与 Gateway 路由联动

目标：

部署成功后自动创建 Gateway 路由和 public_url。

任务：

1. Deploy 成功后生成 internal_url；
2. 创建或更新 mcp_deployments；
3. 创建或更新 mcp_gateway_routes；
4. 生成 public_url；
5. 写回部署状态 running；
6. 健康检查失败时写 failed；
7. stop 时禁用路由或让 Gateway 根据 stopped 拦截；
8. start 后恢复访问。

验收：

1. 托管 MCP 发布成功后可以拿到 public_url；
2. Gateway route 自动启用；
3. stop 后访问被拦截；
4. start 后访问恢复；
5. 部署失败原因可查询。

## Phase 9：前端 MCP 运行监控中心

目标：

新增前端页面展示 MCP 运行实例和操作。

任务：

1. 新增 /developer/mcp-runtime 页面；
2. 接入 /api/mcp-runtime/deployments；
3. 展示运行实例列表；
4. 展示部署记录；
5. 展示调用记录；
6. 实现启动 / 停止 / 重启；
7. 实现复制访问地址；
8. 空状态只展示提示；
9. mock 数据放到 src/temp；
10. 不大幅调整现有 UI 风格。

验收：

1. 页面风格与 Haze 保持一致；
2. 表格字段清晰；
3. 按钮调用真实接口；
4. 无硬编码大量 mock；
5. 不影响开发者中心现有能力列表。

## Phase 10：安全加固

目标：

增强托管 MCP 的运行隔离。

任务：

1. MCP Pod 非 root 运行；
2. 禁止 privileged；
3. 禁止 hostNetwork；
4. 禁止 hostPath；
5. 增加资源限制；
6. 增加 NetworkPolicy；
7. Secret 不写入日志；
8. Gateway 增加 token 校验；
9. Gateway 增加基础限流；
10. MCP Pod 禁止访问 Haze Backend / DB / Redis。

验收：

1. MCP Pod 不能访问 Haze DB；
2. MCP Pod 不能访问 Haze Backend；
3. MCP Pod 不能访问其他 MCP Pod；
4. 资源超限会被 K8s 限制；
5. 敏感信息不进入普通日志。

