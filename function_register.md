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

- 2026-06-28 change: Added independent documentation ZIP upload tokens and storage metadata for Skill/MCP. Documentation ZIP can be replaced through capability edit in every lifecycle status without replacing the capability ZIP.
- 2026-06-28 APIs: `POST /api/developer/uploads/documentation`; create/update capability payloads accept `documentation_upload_token`.
- 2026-06-28 verification: Python compile for storage, schemas, router, and service.

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

- 2026-06-28 change: The Skill/MCP form file area now has Capability Files and Documentation tabs. Documentation uses ZIP upload and remains editable for published capabilities; both upload panels use a fixed height with internal scrolling.
- 2026-06-28 main files: `DeveloperAssetFormDialog.tsx`, `ZipUploadField.tsx`, `useDeveloperCapabilities.ts`, `DeveloperCenter.tsx`, capability types/API client.
- 2026-06-28 verification: frontend TypeScript no-emit check.

### Marketplace capability listing and favorites

- 所属模块：marketplace
- 功能状态：变更
- 涉及接口：`GET /api/marketplace/capabilities`、`GET /api/marketplace/capabilities/{id}/content`、`POST /api/marketplace/capabilities/{id}/favorite`
- 涉及数据表：`capability_favorites`、`capabilities`、`capability_versions`（均只读）
- 涉及主要文件：`backend/alembic/versions/20260624_0003_marketplace_favorites.py`、`backend/app/modules/marketplace/models.py`、`backend/app/modules/marketplace/schemas.py`、`backend/app/modules/marketplace/router.py`、`backend/app/db/base.py`、`backend/app/main.py`
- 功能说明：将 status=published 的能力展示到能力市场，支持分页、搜索、类型/分类/收藏筛选；市场详情返回 MCP 连接方式和版本记录，并可受限读取 ZIP 内的 `quick_start.md` 与 `README.md`。
- 本次改动说明：新增市场内容接口，仅允许读取 `quick_start.md` 和 `README.md`，支持 ZIP 外层目录，限制单文件 1MB 并使用 UTF-8 解码；文件缺失时返回空内容。
- 是否影响已有功能：仅改变能力市场「快速开始 / 查看文档」内容来源，不改变开发者中心上传、版本和发布逻辑。
- 验证方式：市场 schema/router Python 语法检查，前端 TypeScript 检查，静态核对两个 Tab 的文件映射。
- 更新时间：2026-06-27

- 2026-06-28 change: Quick Start and Documentation now read only from the independent documentation package. Relative Markdown images are loaded through an authenticated, path-restricted document asset endpoint.
- 2026-06-28 API: `GET /api/marketplace/capabilities/{id}/documentation/{asset_path}`.
- 2026-06-28 impact: Existing capability ZIP and version/deployment logic are unchanged; capabilities without an uploaded documentation package show the existing empty state.
- 2026-06-28 API: `GET /api/marketplace/capabilities/{id}/download` returns the original uploaded Skill or STDIO MCP ZIP and requires `Authorization: Bearer <personal service credential>`. HTTP MCP and documentation ZIP downloads are rejected.
- 2026-06-28 change: Marketplace list responses now include `server_url` for HTTP MCP, preferring deployment `public_url` and falling back to configured `serverUrl`. Copy actions render configurable Skill/STDIO/HTTP access Prompt templates; HTTP Prompt copy fetches and embeds the current personal service credential.
- 2026-06-28 API: `POST /api/marketplace/capabilities/{id}/download-link` creates a 30-minute URL; `GET /api/public/downloads/{token}` returns the original Skill/STDIO MCP ZIP without login authentication.
- 2026-06-28 table: `capability_download_tokens` stores only SHA-256 token hashes, package snapshots, creator, expiry, and revocation state.
- 2026-06-28 errors: Invalid, expired, revoked, offline, unsupported, and missing-file responses use the unified JSON envelope with a user-readable `message`.
- 2026-06-28 config: `DOWNLOAD_PUBLIC_BASE_URL` controls local/public URL generation and `DOWNLOAD_LINK_EXPIRE_MINUTES` defaults to 30.

### Capability lifecycle status flow (submit-review / deploy / debug / publish)

- 所属模块：capabilities / developer center / audit
- 功能状态：修改
- 涉及接口：新增 `POST /api/developer/capabilities/{id}/submit-review`、`/deploy`、`/debug`；`/publish` 改为真实发布；`GET /api/developer/capabilities` status 过滤扩展全状态；`POST /api/audit/capabilities/{id}/review` 通过落点由 `published` 改为 `approved`
- 涉及数据表：`capabilities`（status 取值扩展，无 DDL 变更）、`capability_audit_records`
- 涉及主要文件：`backend/app/modules/capabilities/{service,router,schemas}.py`、`backend/app/modules/audit/{router,models}.py`、`frontend/src/types/developer-center.ts`、`frontend/src/components/common/StatusBadge.tsx`、`frontend/src/i18n/*`、`frontend/src/lib/capabilities.ts`、`frontend/src/components/developer-center/{useDeveloperCapabilities.ts,DeveloperAssetTable.tsx}`、`frontend/src/Dashboard/pages/DeveloperCenter.tsx`
- 功能说明：补全能力状态机 `草稿 → 待审核 → 审核通过/驳回 → 部署完成/失败 → 调试通过/失败 → 已发布`。按类型分流：Skill 走 1-2-3-6；STDIO MCP 走 1-2-3-5-6（跳过部署）；HTTP MCP 走完整 1-2-3-4-5-6。各转换按 type/transport 校验起始状态，越级返回 409，保证严格按顺序执行。开发者中心下拉菜单在「复制 Prompt」下方新增「部署服务」、在「发布」上方新增「提交审核」，行内「调试」按钮按状态可用；审核仍走管理员审核页（落点 approved）。
- 本次改动说明：部署/调试功能尚未开发，对应接口当前默认置为通过（部署完成 / 调试通过）；修复 `capability_audit_records.id` 在 SQLite 下未自增的潜在缺陷（改用 BIGINT_PK 变体）；`reviewing` 中文标签由「审核中」改为「待审核」。
- 是否影响已有功能：`/publish` 语义由「提交审核」改为「真实发布」，提交审核迁移到 `/submit-review`；能力市场仍只展示 `published`，不受影响；既有测试已同步更新。
- 验证方式：后端 pytest 19 项全部通过（含新增三类能力顺序流转与越级拦截用例）；前端 `tsc --noEmit` 无报错。
- 更新时间：2026-06-24

### Developer center table: deploy/test status columns and 部署/测试 action

- 所属模块：frontend developer center
- 功能状态：修改
- 涉及主要文件：`frontend/src/components/developer-center/DeveloperAssetTable.tsx`、`frontend/src/Dashboard/pages/DeveloperCenter.tsx`、`backend/app/modules/capabilities/service.py`
- 功能说明：开发者中心列表在「测试」列前新增「部署状态」列（Skill 与 STDIO MCP 显示「无需部署」，HTTP MCP 显示 未部署/部署完成/部署失败）；「测试」列改名为「测试状态」（Skill 显示「无需测试」）。行内「调试」按钮改为「部署/测试」下拉按钮，整合「服务部署」（onDeployAsset）与「连接测试」（onDebugComplete，点击即测试通过）两项，按状态置灰；原「…」更多菜单中的部署/连接测试项移除。
- 本次改动说明：连接测试改为点击即通过，移除 DeveloperCenter 中的 McpConnectionTestDialog 挂载（弹窗组件文件保留未引用）；后端 `mark_debug_passed` 同步将 `recent_test_status` 置为 `pass`，使「测试状态」列反映调试结果。
- 是否影响已有功能：仅调整开发者中心表格列与操作入口；状态机与接口不变。
- 验证方式：前端 `tsc --noEmit` 无报错；后端 pytest 19 项全部通过。
- 更新时间：2026-06-24

### STDIO MCP Docker 隔离调试

- 所属模块：capabilities / test_runner
- 功能状态：修改
- 涉及接口：`GET /api/developer/capabilities/{id}/test-run`（SSE，已有路由，行为变更）
- 涉及数据表：无
- 涉及主要文件：`backend/app/modules/capabilities/test_runner.py`、`backend/app/modules/capabilities/router.py`
- 功能说明：将 STDIO MCP 调试从宿主机直接 subprocess 改为 Docker 容器隔离执行，分 9 步：0-识别运行时（package.json→Node / requirements.txt→Python）、1-拉起容器（docker run -d --network none）、2-安装依赖（npm install / pip install）、3-进程存活检测、4-stdout 格式检测（首条 JSON-RPC 校验）、5-stderr 检测（有 ERROR 警告不阻断）、6-initialize、7-tools/list、8-tools/call（仅当 ZIP 内含 mcp-test.json 时）。调试完成后销毁容器并清理临时目录。
- 本次改动说明：`run_stdio_mcp_test` 新增 `zip_path` 参数；router 从 `capability.extension_json["package"]["path"]` 取 ZIP 相对路径，拼 `local_storage_dir` 绝对路径传入。HTTP MCP 测试逻辑不变。
- 是否影响已有功能：HTTP MCP 测试路径完全不变；STDIO 调试结果写回 `recent_test_status` 逻辑不变；前端 SSE 事件格式不变。需要服务器上安装 Docker。
- 验证方式：Python import 检查通过；backend pytest 4 项全部通过。
- 更新时间：2026-06-24

### Personal center profile and personal service credential

- Module: auth / users / personal service credential
- Status: changed
- APIs: `PATCH /api/auth/me/profile`, `POST /api/auth/me/reset-password`, `GET /api/auth/me/mcp-credential`, `POST /api/auth/me/mcp-credential/reset`
- Tables: `users.avatar_url`, `user_mcp_credentials`
- Main files: `backend/app/modules/auth/`, `backend/app/modules/users/models.py`, `backend/alembic/versions/20260626_0006_personal_profile_mcp_credential.py`, `frontend/src/Dashboard/pages/PersonalCenter.tsx`, `frontend/src/lib/profile.ts`
- Summary: Adds self-service personal center support. Users can manage a personal service access credential used as a Bearer token for approved service APIs. New credentials use the `haze_` prefix; legacy `haze_mcp_` credentials rotate when the credential page is opened.
- Impact: Existing credential endpoints remain compatible. Legacy credential rotation invalidates the previous key. Normal login JWTs are not accepted by personal-credential-only APIs.
- Verification: Python compile, Alembic upgrade check, and frontend build.
- Updated: 2026-06-28

### Developer center MCP sandbox auto debug pass

- Module: capabilities / developer center
- Status: changed
- APIs: `GET /api/developer/capabilities/{id}/test-run`
- Tables: `capabilities`
- Main files: `backend/app/modules/capabilities/router.py`, `frontend/src/components/developer-center/McpConnectionTestDialog.tsx`, `frontend/src/Dashboard/pages/DeveloperCenter.tsx`, `frontend/src/components/developer-center/useDeveloperCapabilities.ts`
- Summary: Removes the manual Mark Passed button from the MCP sandbox test dialog. When a sandbox test finishes with pass, the backend now records `recent_test_status=pass` and automatically advances eligible MCP capabilities to `debug_passed`.
- Impact: Keeps failed test behavior unchanged. Published/offline/debug_passed capabilities are not demoted by retesting; only eligible debugging states are advanced.
- Verification: Frontend build; backend compile was not run because the local Python environment is unavailable.
- Updated: 2026-06-26
### Home capability portal overview and personal usage

- 所属模块：home / marketplace / capabilities / audit
- 功能状态：新增
- 涉及接口：`GET /api/home/overview`、`POST /api/home/capabilities/{id}/usage`
- 涉及数据表：`capability_user_usage`、`capabilities`、`capability_favorites`、`capability_audit_records`
- 涉及主要文件：`backend/app/modules/home/`、`frontend/src/Dashboard/pages/Home.tsx`、`frontend/src/lib/home.ts`、`frontend/src/Dashboard/pages/Market.tsx`
- 功能说明：首页提供已发布能力、本周新增、我的能力、待审核真实指标，以及推荐/最新/热门能力、我的收藏和个人常用能力；推荐按调用量 70% 与 30 天新鲜度 30% 计算。能力市场快速开始成功后累计个人使用次数。
- 是否影响已有功能：不改变能力市场和审核接口响应；新增独立首页聚合接口与个人使用记录表。无开发或审核权限时对应指标卡显示禁用态。
- 验证方式：前端 TypeScript no-emit 检查；后端模块与迁移语法检查。
- 更新时间：2026-06-28
### MCP runtime monitoring metadata and metrics

- 所属模块：mcp_runtime / capabilities / frontend MCP 运行监控
- 功能状态：修复
- 涉及接口：`GET /api/mcp-runtime/deployments`、`GET /api/mcp-runtime/deployments/{id}/calls`、`GET /api/mcp-runtime/deployments/{id}/tasks`
- 涉及数据表：`mcp_deployments`、`mcp_deploy_tasks`、`mcp_call_logs`、`capability_versions`、`users`
- 涉及主要文件：`backend/app/modules/mcp_runtime/{schemas,service}.py`、`backend/app/modules/capabilities/service.py`、`frontend/src/Dashboard/pages/McpRuntime.tsx`、`frontend/src/lib/capabilities.ts`
- 本次改动说明：运行实例返回能力创建人；调用记录返回调用人姓名及全量今日成功率/平均耗时指标；部署记录返回版本号。首次创建实例记录 deploy，已有实例的新版本或重试部署记录 redeploy；数据迁移将历史每个能力除最早一条外的重复 deploy 纠正为 redeploy。
- 是否影响已有功能：仅扩展 MCP Runtime 响应字段和修正部署任务类型，不改变运行操作权限、路由或状态机。
- 验证方式：前端 TypeScript no-emit 检查、后端 Python 语法检查、迁移语法检查。
- 更新时间：2026-06-28

### System management business categories

- Module: system management / business categories / capabilities / marketplace
- Status: added
- APIs: `GET/POST /api/business-categories`, `PUT/DELETE /api/business-categories/{id}`; capability write APIs now accept `category_id`
- Tables: `business_categories`, `capabilities.category_id`
- Main files: `backend/app/modules/business_categories/`, `backend/alembic/versions/20260629_0012_business_categories.py`, `frontend/src/Dashboard/pages/SystemManagement.tsx`
- Summary: Adds administrator-managed business categories with case-insensitive unique names and creator/updater audit fields. Capability records reference category IDs, while read APIs retain the category name and add `category_id`. Developer Center and Marketplace load the shared category source.
- Impact: Historical category strings are migrated to managed rows; built-in categories are seeded and unmatched historical names are preserved. Referenced categories return HTTP 409 on deletion. Existing display responses retain the `category` field.
- Verification: Frontend TypeScript no-emit and production build passed. Fixed the backend response-module import and made migration 0012 resumable after non-transactional MySQL partial failure; backend execution still requires the user environment because the sandbox cannot launch its Python interpreter or Docker Desktop.
- Updated: 2026-06-29
### Linux Docker Compose production deployment

- Module: deployment / frontend / backend / MCP gateway
- Status: added
- APIs: no API changes
- Tables: external MySQL; no schema changes
- Main files: `docker-compose.yml`, `backend/Dockerfile`, `frontend/Dockerfile`, `frontend/nginx.conf`
- Summary: Adds a single-host Linux Docker Compose deployment for the frontend, backend API, and MCP Gateway. The backend runs Alembic migrations before startup, the frontend proxies `/api` to the backend, and uploads are bind-mounted to a configurable Linux host directory instead of the container writable layer.
- Impact: Existing application behavior is unchanged. The Compose stack starts the Kubernetes deployment Worker by default, mounts the Linux Docker socket for MCP image builds, and mounts kubeconfig plus Docker registry credentials for Kubernetes deployment and image push.
- Verification: `docker compose config --quiet` passed with placeholder production, kubeconfig, and registry environment variables.
- Updated: 2026-06-29
### Personal credential user profile API

- Module: auth / personal service credential
- Status: added
- APIs: `GET /api/auth/personal-credential/me`
- Tables: `users`, `user_mcp_credentials`
- Main files: `backend/app/modules/auth/router.py`, `backend/app/core/security.py`, `backend/tests/test_auth_users.py`
- Summary: Adds a personal-service-credential-only endpoint that returns the existing authenticated user profile shape. Invalid, reset, disabled-user, or deleted-user credentials return HTTP 401 with `message=invalid or expired personal service credential`.
- Impact: Existing JWT `/api/auth/me` behavior and response shape are unchanged. The shared personal credential validator now reports invalid credentials as invalid or expired.
- Verification: Targeted authentication test and Python syntax check.
- Updated: 2026-06-30