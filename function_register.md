# Function Register

本文件用于登记 Haze Tool 后端已经实现、修改或稳定的功能。

后端每次新增、修改、修复功能前，必须先查看本文件。
后端每次完成新增、修改、修复功能后，必须更新本文件。

---

## 功能登记模板

### 功能名称

- 所属模块：
- 功能状态：新增 / 修改 / 修复 / 已稳定
- 涉及接口：
- 涉及数据表：
- 涉及主要文件：
- 功能说明：
- 本次改动说明：
- 是否影响已有功能：
- 验证方式：
- 更新时间：

---

## 已登记功能

### 后端基础骨架与系统探针

- 所属模块：后端基础设施 / 系统接口
- 功能状态：新增
- 涉及接口：`GET /api/health`、`GET /api/version`、`GET /docs`、`GET /redoc`
- 涉及数据表：无
- 涉及主要文件：`backend/app/main.py`、`backend/app/core/`、`backend/app/db/`、`backend/alembic/`
- 功能说明：建立 FastAPI、SQLAlchemy 2.x、Alembic、Pydantic v2 和 MySQL 后端骨架，提供统一响应、request-id、异常处理、JWT/RBAC 基础能力及系统探针。
- 本次改动说明：新增首版后端目录、配置、数据库会话、迁移环境、模块边界、自动化测试；前端仅新增 API 地址配置和通用 API client。
- 是否影响已有功能：不影响现有前端页面结构、样式和交互；未接入任何业务页面。
- 验证方式：后端 pytest 与 Python 编译检查；前端 TypeScript 检查和生产构建；Alembic 配置加载检查。
- 更新时间：2026-06-23
### Authentication and four-level RBAC

- 所属模块：auth / users / roles / capabilities
- 功能状态：新增
- 涉及接口：`POST /api/auth/login`、`POST /api/auth/logout`、`GET /api/auth/me`
- 涉及数据表：`departments`、`users`、`roles`、`permissions`、`user_roles`、`role_permissions`
- 涉及主要文件：`backend/app/modules/auth/`、`backend/app/core/security.py`、`backend/app/bootstrap.py`
- 功能说明：实现手机号登录、60 分钟 JWT、token_version 即时失效、系统管理员/管理员/开发者/使用者四级 RBAC，以及幂等初始化。
- 本次改动说明：仅初始化 env admin 为系统管理员；系统管理员自动拥有全部数据库权限，管理员拥有当前业务及成员管理权限。
- 是否影响已有功能：扩展原安全骨架，不改变健康检查、版本接口和统一响应结构。
- 验证方式：pytest 覆盖登录、登出、过期/失效 token、角色权限和 bootstrap 幂等行为。
- 更新时间：2026-06-23

### Enterprise member management

- 所属模块：users / departments / roles
- 功能状态：新增
- 涉及接口：`GET/POST /api/users`、`GET/PATCH/DELETE /api/users/{member_no}`、角色修改、密码重置、启禁用、角色与部门选项接口
- 涉及数据表：`departments`、`users`、`roles`、`user_roles`
- 涉及主要文件：`backend/app/modules/users/`、`frontend/src/Dashboard/pages/Settings.tsx`、`frontend/src/lib/members.ts`
- 功能说明：实现成员分页查询、添加、编辑、详情、单角色修改、随机临时密码、启禁用和 deleted 时间戳软删除。
- 本次改动说明：成员管理与登录页面接入真实 API，删除成员 mock 数据；保留现有 UI 结构和样式。
- 是否影响已有功能：前端会话改为真实 JWT；401 自动清理会话并返回登录页，侧边栏按页面权限显示。
- 验证方式：pytest 15 项通过；前端 TypeScript 检查通过。
- 更新时间：2026-06-23

### Developer center capability asset tables

- 所属模块：capabilities / developer center
- 功能状态：新增
- 涉及接口：无
- 涉及数据表：`capabilities`、`capability_versions`
- 涉及主要文件：`backend/app/modules/capabilities/models.py`、`backend/alembic/versions/20260623_0002_capability_assets.py`、`backend/app/db/base.py`
- 功能说明：建立 Skill / MCP 共用的能力资产主表与能力版本快照表，支持负责人、部门、创建人、更新人、扩展 JSON、软删除和版本历史。
- 本次改动说明：新增带完整中文表注释和字段注释的数据库迁移及 SQLAlchemy 模型；本次不迁移或预置业务数据，不调整 UI 和 API。
- 是否影响已有功能：仅新增数据库表和 ORM 元数据注册，不改变现有认证、成员管理、接口响应和前端行为。
- 验证方式：Python 编译检查、Alembic revision 链检查、MySQL 离线迁移 SQL 核对；可用数据库环境下执行升级并核对 information_schema。
- 更新时间：2026-06-23
### Developer center capability APIs

- 所属模块：capabilities / developer center
- 功能状态：新增
- 涉及接口：`GET/POST /api/developer/capabilities`、能力详情/编辑/版本、发布/下线/删除、测试状态回写、图标读取及图标/ZIP 预上传接口
- 涉及数据表：`capabilities`、`capability_versions`
- 涉及主要文件：`backend/app/modules/capabilities/`、`backend/app/core/rbac.py`、`backend/app/main.py`
- 功能说明：实现开发者能力列表、Skill/MCP 注册、图标和安全 ZIP 上传解析、配置编辑、版本快照、发布下线、软删除及 MCP 测试结果回写。
- 本次改动说明：开发者仅管理本人能力，管理员可管理全部；发布操作改为提交审核并写入 `reviewing` 状态，新建版本后同样进入 `reviewing`；Skill 默认无需测试，MCP 测试状态仍由管理员回写；删除时清理文件并归档 code 以允许复用。
- 是否影响已有功能：新增后端接口和能力权限，不修改前端 UI、不实现调试执行和复制 Prompt；保持现有认证和统一响应结构。
- 验证方式：能力 API 目标 pytest、现有认证/成员回归测试、Python 编译、路由加载和 SQLite 元数据建表检查。
- 更新时间：2026-06-24

### Developer center frontend API integration

- 所属模块：frontend developer center / capabilities API
- 功能状态：修改
- 涉及接口：能力列表、注册、编辑、版本、发布、下线、删除、图标读取及图标/ZIP 预上传接口
- 涉及数据表：`capabilities`、`capability_versions`
- 涉及主要文件：`frontend/src/Dashboard/pages/DeveloperCenter.tsx`、`frontend/src/lib/capabilities.ts`、`frontend/src/components/developer-center/useDeveloperCapabilities.ts`
- 功能说明：将开发者中心表格、Skill/MCP 注册、上传解析、编辑、新版本和状态操作接入真实后端 API，并通过鉴权 Blob 请求展示能力图标。
- 本次改动说明：保留现有页面布局、样式和操作入口；删除开发者中心临时资产、版本和测试记录；发布/新版本提交后展示后端 `reviewing` 审核中状态；本地 MCP 模拟不再伪造正式测试通过状态。
- 是否影响已有功能：仅替换开发者中心数据流和事件处理，不调整其他页面；复制 Prompt 与本地模拟调试入口保留。
- 验证方式：前端 TypeScript 检查、Vite 生产构建、后端完整 pytest 和临时数据引用扫描。
- 更新时间：2026-06-24

### Marketplace capability listing and favorites

- 所属模块：marketplace
- 功能状态：新增
- 涉及接口：`GET /api/marketplace/capabilities`、`POST /api/marketplace/capabilities/{id}/favorite`
- 涉及数据表：`capability_favorites`（新增）、`capabilities`（只读）
- 涉及主要文件：`backend/alembic/versions/20260624_0003_marketplace_favorites.py`、`backend/app/modules/marketplace/models.py`、`backend/app/modules/marketplace/schemas.py`、`backend/app/modules/marketplace/router.py`、`backend/app/db/base.py`、`backend/app/main.py`
- 功能说明：将 status=published 的能力展示到能力市场，支持分页、搜索、类型/分类/收藏筛选；开发者字段以「姓名 · 部门」格式返回；收藏接口幂等切换，防重复入库。
- 本次改动说明：全新 marketplace 模块；前端删除 marketplaceSkills、marketplaceMcpServers、capabilityMarketplaceData 三个 mock 文件，Market.tsx 初始 state 改为空数组，不修改页面结构和样式。
- 是否影响已有功能：不影响开发者中心、认证、成员管理等已有接口；marketplace router 独立挂载。
- 验证方式：后端 pytest 18 项全部通过；前端 TypeScript 检查无报错。
- 更新时间：2026-06-24
