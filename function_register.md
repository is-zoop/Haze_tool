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