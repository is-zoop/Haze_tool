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