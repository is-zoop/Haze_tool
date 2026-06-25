# Haze MCP 托管部署与调试发布 PRD

## 1. 背景

Haze 当前已经支持用户上传 ZIP 源码并注册 Skill / MCP 能力。接下来需要补充 MCP 的托管部署、调试、发布和运行管理能力。

本方案采用简化流程：

> 用户上传 ZIP → 提交审核 → 审核通过后部署 Server → 部署完成后调试 → 调试通过后点击发布 → 发布后用户可见可调用

该方案不单独做审核前调试环境，避免提前部署造成资源浪费和管理复杂度。

---

## 2. 目标

实现 MCP 能力从上传、审核、部署、调试到发布的完整闭环。

最终用户体验：

1. 开发者上传 MCP ZIP 源码；
2. 保存为草稿；
3. 提交审核；
4. 审核通过后，系统自动部署 MCP Server；
5. 部署完成后，开发者进入调试台；
6. 调试通过后，开发者点击发布；
7. 发布后能力进入市场，普通用户可见可调用。

---

## 3. 非目标

第一版不做：

1. 审核前临时调试环境；
2. 外部 HTTP MCP 地址注册；
3. 自动扩缩容；
4. 多副本管理；
5. 灰度发布；
6. 蓝绿发布；
7. MCP Tool 明细表；
8. 能力权限授权表；
9. 复杂 Prometheus 图表；
10. 前端直接操作 K8s；
11. Haze Backend 直接操作 K8s。

---

## 4. 核心角色

### 4.1 Haze Backend

现有 Haze 后端，负责业务控制。

职责：

* 能力草稿保存；
* 提交审核；
* 审核状态管理；
* 审核通过后创建部署任务；
* 查询部署状态；
* 查询调试状态；
* 调试通过后允许发布；
* 已发布能力对普通用户可见。

Haze Backend 不直接操作 K8s。

---

### 4.2 Deploy Worker

新增部署执行器。

职责：

* 消费部署任务；
* 校验 ZIP / haze.yaml；
* 构建镜像；
* 推送镜像；
* 创建 K8s Deployment / Service / ConfigMap / Secret / NetworkPolicy；
* 健康检查；
* 创建 Gateway 路由；
* 回写部署状态。

---

### 4.3 MCP Gateway

新增 MCP 统一网关。

职责：

* 提供 MCP 统一访问入口；
* 根据能力 code 转发请求；
* 控制未发布能力不可被普通用户调用；
* 支持开发者调试访问；
* 记录调用日志；
* 透传 MCP Header。

---

### 4.4 Sandbox Runtime

K8s 中动态创建的 MCP Server 运行环境。

每个 HTTP MCP Server 对应：

* Deployment；
* Service；
* ConfigMap；
* Secret；
* NetworkPolicy。

---

## 5. 状态设计

建议将产品流程状态定义为：

```text
草稿
审核中
审核拒绝
审核通过
部署中
部署失败
待调试
调试失败
调试通过
已发布
已下线
```

### 5.1 状态说明

| 状态   | 说明                     | 普通用户是否可见 |
| ---- | ---------------------- | -------- |
| 草稿   | 开发者已上传 ZIP，未提交审核       | 否        |
| 审核中  | 等待管理员审核                | 否        |
| 审核拒绝 | 审核未通过，可修改后重新提交         | 否        |
| 审核通过 | 管理员审核通过，等待部署           | 否        |
| 部署中  | Worker 正在构建镜像并部署 K8s   | 否        |
| 部署失败 | 构建、启动或健康检查失败           | 否        |
| 待调试  | MCP Server 已部署，等待开发者调试 | 否        |
| 调试失败 | 调试未通过，需要查看日志或重新部署      | 否        |
| 调试通过 | 开发者已完成调试，可点击发布         | 否        |
| 已发布  | 能力进入市场，用户可见可调用         | 是        |
| 已下线  | 能力被下线，用户不可调用           | 否        |

---

## 6. 核心流程

### 6.1 HTTP MCP 流程

```text
上传 ZIP
  ↓
保存草稿
  ↓
提交审核
  ↓
审核通过
  ↓
自动创建部署任务
  ↓
Deploy Worker 部署 MCP Server
  ↓
部署完成
  ↓
进入待调试状态
  ↓
开发者调试
  ↓
调试通过
  ↓
点击发布
  ↓
已发布，用户可见可调用
```

### 6.2 STDIO MCP 流程

STDIO 不需要正式部署 Server，也不需要 Gateway 地址。

```text
上传 ZIP
  ↓
保存草稿
  ↓
提交审核
  ↓
审核通过
  ↓
生成 stdio 配置
  ↓
开发者调试 start_command / initialize / tools/list
  ↓
调试通过
  ↓
点击发布
  ↓
用户可见，可复制配置使用
```

---

## 7. 调试规则

### 7.1 HTTP MCP 调试内容

部署完成后，开发者进入 MCP 调试台。

调试内容：

* health_check；
* initialize；
* tools/list；
* tools/call；
* 请求 JSON；
* 响应 JSON；
* 响应耗时；
* 错误信息；
* 部署日志；
* 运行日志。

### 7.2 STDIO MCP 调试内容

STDIO 调试内容：

* start_command 是否可执行；
* 进程是否正常启动；
* stdout 是否只输出 MCP 协议消息；
* stderr 日志是否正常；
* initialize；
* tools/list；
* tools/call；
* 生成客户端配置。

### 7.3 发布限制

只有满足以下条件，才允许点击发布：

```text
审核状态 = 审核通过
部署状态 = 待调试 / 已部署
调试状态 = 调试通过
```

发布后才允许普通用户看到和调用。

---

## 8. Gateway 访问规则

### 8.1 调试阶段

部署完成但未发布时：

* Gateway 路由可以存在；
* 仅能力创建者和管理员可访问；
* 普通用户不可见、不可调用；
* 能力市场不展示。

### 8.2 发布阶段

点击发布后：

* 能力状态变为已发布；
* Gateway 路由对普通用户开放；
* 能力市场展示；
* 用户可通过 MCP Gateway 调用。

---

## 9. 数据模型建议

当前已有 `capabilities` 和 `capability_versions`，不要重复创建。

新增运行相关表即可。

### 9.1 mcp_deploy_tasks

部署任务表。

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

task_type：

```text
deploy / start / stop / restart / redeploy
```

task_status：

```text
pending / running / success / failed
```

---

### 9.2 mcp_deployments

部署实例表。

字段建议：

```text
id
capability_id
version_id
deployment_name
namespace
runtime_provider
deploy_status
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
```

deploy_status：

```text
not_deployed / building / deploying / deployed / failed / stopped
```

---

### 9.3 mcp_gateway_routes

Gateway 路由表。

字段建议：

```text
id
capability_id
deployment_id
asset_code
route_path
target_url
exposure
enabled
auth_required
rate_limit
created_at
updated_at
```

exposure：

```text
developer_only / public
```

说明：

* 调试阶段：developer_only；
* 发布阶段：public。

---

### 9.4 mcp_debug_records

调试记录表。

字段建议：

```text
id
capability_id
deployment_id
debug_status
test_items_json
request_json
response_json
duration_ms
error_message
created_by
created_at
```

debug_status：

```text
running / passed / failed
```

---

### 9.5 mcp_call_logs

调用日志表。

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

---

## 10. 接口设计

### 10.1 后端运行管理接口

新增前缀：

```text
/api/mcp-runtime
```

接口：

```text
GET  /api/mcp-runtime/deployments
GET  /api/mcp-runtime/deployments/{id}
GET  /api/mcp-runtime/deployments/{id}/tasks
GET  /api/mcp-runtime/deployments/{id}/logs
POST /api/mcp-runtime/deployments/{id}/restart
POST /api/mcp-runtime/deployments/{id}/redeploy
```

---

### 10.2 调试接口

```text
POST /api/mcp-runtime/deployments/{id}/debug/health
POST /api/mcp-runtime/deployments/{id}/debug/initialize
GET  /api/mcp-runtime/deployments/{id}/debug/tools
POST /api/mcp-runtime/deployments/{id}/debug/tools/{tool_name}/call
GET  /api/mcp-runtime/deployments/{id}/debug/records
```

---

### 10.3 发布接口

可在现有能力模块中新增或复用：

```text
POST /api/developer/capabilities/{id}/release
```

规则：

* 只有调试通过才允许 release；
* release 后能力状态变为 published；
* Gateway route exposure 改为 public；
* 能力市场开始展示。

---

## 11. 前端页面

### 11.1 开发者中心能力详情页

新增流程状态展示：

```text
草稿 → 审核中 → 审核通过 → 部署中 → 待调试 → 调试通过 → 已发布
```

不同状态展示不同按钮：

| 状态   | 按钮        |
| ---- | --------- |
| 草稿   | 编辑、提交审核   |
| 审核中  | 查看审核状态    |
| 审核拒绝 | 编辑、重新提交   |
| 部署中  | 查看部署日志    |
| 部署失败 | 查看日志、重新部署 |
| 待调试  | 进入调试台     |
| 调试失败 | 重新调试、查看日志 |
| 调试通过 | 发布        |
| 已发布  | 查看访问地址、下线 |

---

### 11.2 MCP 调试台

页面结构：

```text
连接检查
工具调试
运行日志
调试记录
```

连接检查：

* health_check；
* initialize；
* tools/list。

工具调试：

* 工具列表；
* 参数 Schema；
* 参数输入；
* 运行按钮；
* 请求 JSON；
* 响应 JSON。

运行日志：

* 构建日志；
* Pod 日志；
* 最近错误。

调试记录：

* 调试人；
* 调试时间；
* 调试结果；
* 错误信息。

---

### 11.3 能力市场

只展示：

```text
状态 = 已发布
```

不展示：

```text
审核通过
部署完成
待调试
调试通过
```

---

## 12. 分阶段开发计划

### Phase 1：状态与数据模型

目标：

新增 MCP 部署、调试、Gateway、调用日志相关表。

任务：

1. 新增 mcp_runtime 模块；
2. 新增 mcp_deploy_tasks；
3. 新增 mcp_deployments；
4. 新增 mcp_gateway_routes；
5. 新增 mcp_debug_records；
6. 新增 mcp_call_logs；
7. 新增状态枚举；
8. 增加 Alembic 迁移；
9. 更新 function_register.md。

---

### Phase 2：审核通过后创建部署任务

目标：

审核通过后自动进入部署流程。

任务：

1. 识别 HTTP MCP；
2. 审核通过后创建 deploy task；
3. 状态进入部署中；
4. 不影响 Skill；
5. 不影响 STDIO MCP；
6. 更新 function_register.md。

---

### Phase 3：Deploy Worker 基础框架

目标：

新增独立 Worker 消费部署任务。

任务：

1. 新增 Worker 服务；
2. 读取 pending task；
3. 执行任务锁定；
4. 分发 task handler；
5. 写入任务日志；
6. 更新任务状态。

---

### Phase 4：K8s 部署能力

目标：

Deploy Worker 可以部署 HTTP MCP Server。

任务：

1. 校验 ZIP / haze.yaml；
2. 构建镜像；
3. 推送镜像；
4. 创建 K8s Deployment；
5. 创建 K8s Service；
6. 创建 ConfigMap / Secret；
7. 创建 NetworkPolicy；
8. 健康检查；
9. 状态进入待调试。

---

### Phase 5：MCP Gateway

目标：

新增 MCP Gateway 统一入口。

任务：

1. 支持 `/assets/{asset_code}/mcp`；
2. 查询 Gateway route；
3. 支持 developer_only / public；
4. 支持权限校验；
5. 转发 MCP 请求；
6. 写入调用日志。

---

### Phase 6：MCP 调试台后端接口

目标：

支持开发者调试 MCP Server。

任务：

1. health_check；
2. initialize；
3. tools/list；
4. tools/call；
5. 保存调试记录；
6. 调试通过后更新状态。

---

### Phase 7：发布接口

目标：

调试通过后允许正式发布。

任务：

1. 新增 release 接口；
2. 校验调试状态；
3. 更新能力状态为 published；
4. Gateway route exposure 改为 public；
5. 能力市场可见。

---

### Phase 8：前端页面

目标：

完成开发者侧完整操作链路。

任务：

1. 能力详情页增加流程状态；
2. 增加部署日志入口；
3. 增加 MCP 调试台；
4. 增加发布按钮；
5. 能力市场只展示已发布能力；
6. 空状态只显示提示。

---

## 13. 执行要求

1. 每次只实现一个 Phase；
2. 每个 Phase 开始前读取 `function_register.md`；
3. 已有表和已有接口不要重复开发；
4. 不重构无关模块；
5. 不大幅修改现有 UI；
6. 后端改动后更新 `function_register.md`；
7. 前端 mock 数据放到 `src/temp`；
8. Haze Backend 不直接操作 K8s；
9. 前端不直接操作 K8s；
10. Gateway 不暴露内部 Service 地址。
