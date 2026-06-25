from __future__ import annotations

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.exceptions import AppException
from app.core.rbac import ADMIN, SYSTEM_ADMIN
from app.modules.capabilities.models import Capability
from app.modules.mcp_runtime import enums
from app.modules.mcp_runtime.models import McpCallLog, McpDeployment, McpDeployTask
from app.modules.mcp_runtime.schemas import (
    McpCallLogData,
    McpCallLogListData,
    McpDeploymentData,
    McpDeploymentListData,
    McpDeployTaskData,
    McpDeployTaskListData,
    McpTaskCreated,
)
from app.modules.users.models import User

ADMIN_ROLES = {SYSTEM_ADMIN, ADMIN}

# 允许通过 operate 接口触发的任务类型
_OPERATE_TASK_TYPES = {enums.TASK_TYPE_START, enums.TASK_TYPE_STOP, enums.TASK_TYPE_RESTART}


def _is_admin(user: User) -> bool:
    """判断用户是否具备管理员角色。"""
    return any(role.code in ADMIN_ROLES for role in user.roles)


def _serialize_deployment(row: McpDeployment, capability: Capability | None) -> McpDeploymentData:
    """将 ORM 对象转换为响应 Schema。"""
    return McpDeploymentData(
        id=row.id,
        capability_id=row.capability_id,
        capability_name=capability.name if capability else None,
        capability_code=capability.code if capability else None,
        version_id=row.version_id,
        deployment_name=row.deployment_name,
        namespace=row.namespace,
        runtime_provider=row.runtime_provider,
        deploy_status=row.deploy_status,
        desired_status=row.desired_status,
        actual_status=row.actual_status,
        image_url=row.image_url,
        internal_service_name=row.internal_service_name,
        internal_url=row.internal_url,
        public_url=row.public_url,
        gateway_route=row.gateway_route,
        replicas=row.replicas,
        ready_replicas=row.ready_replicas,
        restart_count=row.restart_count,
        health_status=row.health_status,
        last_health_check_at=row.last_health_check_at,
        last_error=row.last_error,
        created_at=row.created_at,
        updated_at=row.updated_at,
        started_at=row.started_at,
        stopped_at=row.stopped_at,
    )


def _serialize_task(row: McpDeployTask) -> McpDeployTaskData:
    """将任务 ORM 对象转换为响应 Schema。"""
    return McpDeployTaskData(
        id=row.id,
        capability_id=row.capability_id,
        version_id=row.version_id,
        task_type=row.task_type,
        task_status=row.task_status,
        runtime_provider=row.runtime_provider,
        logs=row.logs,
        error_message=row.error_message,
        created_by=row.created_by,
        created_at=row.created_at,
        updated_at=row.updated_at,
        started_at=row.started_at,
        finished_at=row.finished_at,
    )


def _get_deployment_or_404(db: Session, deployment_id: int, actor: User) -> McpDeployment:
    """查询部署实例，不存在或无权限均返回 404。"""
    row = db.get(McpDeployment, deployment_id)
    if row is None:
        raise AppException(code=4042, message="部署实例不存在", status_code=404)
    # 管理员可访问全部；普通用户只能访问自己创建的能力的实例
    if not _is_admin(actor):
        cap = db.get(Capability, row.capability_id)
        if cap is None or cap.created_by != actor.id:
            raise AppException(code=4042, message="部署实例不存在", status_code=404)
    return row


# ── 列表查询 ─────────────────────────────────────────────────────────────────

def list_deployments(
    db: Session,
    actor: User,
    *,
    page: int = 1,
    page_size: int = 10,
) -> McpDeploymentListData:
    """查询 MCP 运行实例列表。管理员可查全部，普通用户只查自己的能力。"""
    stmt = select(McpDeployment)
    if not _is_admin(actor):
        # 只返回当前用户创建的能力对应的实例
        my_cap_ids = db.scalars(
            select(Capability.id).where(
                Capability.created_by == actor.id,
                Capability.deleted_at.is_(None),
            )
        ).all()
        stmt = stmt.where(McpDeployment.capability_id.in_(my_cap_ids))

    total = db.scalar(select(func.count()).select_from(stmt.subquery())) or 0
    rows = db.scalars(
        stmt.order_by(McpDeployment.updated_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    ).all()

    # 批量加载关联能力
    cap_ids = {r.capability_id for r in rows}
    cap_map: dict[int, Capability] = {}
    if cap_ids:
        caps = db.scalars(select(Capability).where(Capability.id.in_(cap_ids))).all()
        cap_map = {c.id: c for c in caps}

    items = [_serialize_deployment(r, cap_map.get(r.capability_id)) for r in rows]
    return McpDeploymentListData(items=items, total=total)


def get_deployment(db: Session, deployment_id: int, actor: User) -> McpDeploymentData:
    """查询单个 MCP 运行实例详情。"""
    row = _get_deployment_or_404(db, deployment_id, actor)
    cap = db.get(Capability, row.capability_id)
    return _serialize_deployment(row, cap)


# ── 任务记录 ─────────────────────────────────────────────────────────────────

def list_tasks(
    db: Session,
    deployment_id: int,
    actor: User,
    *,
    page: int = 1,
    page_size: int = 20,
) -> McpDeployTaskListData:
    """查询部署实例的历史任务列表，按创建时间倒序分页。"""
    row = _get_deployment_or_404(db, deployment_id, actor)

    stmt = select(McpDeployTask).where(McpDeployTask.capability_id == row.capability_id)
    total = db.scalar(select(func.count()).select_from(stmt.subquery())) or 0
    tasks = db.scalars(
        stmt.order_by(McpDeployTask.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    ).all()

    return McpDeployTaskListData(items=[_serialize_task(t) for t in tasks], total=total)


def get_logs(db: Session, deployment_id: int, actor: User) -> str:
    """获取最新一条 deploy 任务的执行日志，无日志时返回空字符串。"""
    row = _get_deployment_or_404(db, deployment_id, actor)

    latest_task = db.scalar(
        select(McpDeployTask)
        .where(McpDeployTask.capability_id == row.capability_id)
        .order_by(McpDeployTask.created_at.desc())
        .limit(1)
    )
    if latest_task is None or latest_task.logs is None:
        return ""
    return latest_task.logs


# ── 调用日志 ─────────────────────────────────────────────────────────────────

def list_calls(
    db: Session,
    deployment_id: int,
    actor: User,
    *,
    page: int = 1,
    page_size: int = 20,
) -> McpCallLogListData:
    """查询部署实例的 Gateway 调用日志，按调用时间倒序分页。"""
    row = _get_deployment_or_404(db, deployment_id, actor)

    stmt = select(McpCallLog).where(McpCallLog.deployment_id == row.id)
    total = db.scalar(select(func.count()).select_from(stmt.subquery())) or 0
    logs = db.scalars(
        stmt.order_by(McpCallLog.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    ).all()

    items = [
        McpCallLogData(
            id=log.id,
            capability_id=log.capability_id,
            deployment_id=log.deployment_id,
            asset_code=log.asset_code,
            request_id=log.request_id,
            user_id=log.user_id,
            client_ip=log.client_ip,
            method=log.method,
            tool_name=log.tool_name,
            status_code=log.status_code,
            success=log.success,
            duration_ms=log.duration_ms,
            error_message=log.error_message,
            created_at=log.created_at,
        )
        for log in logs
    ]
    return McpCallLogListData(items=items, total=total)


# ── 运行操作 ─────────────────────────────────────────────────────────────────

def create_operate_task(
    db: Session,
    deployment_id: int,
    actor: User,
    task_type: str,
) -> McpTaskCreated:
    """创建 start / stop / restart 任务。只写入任务记录，不直接操作 K8s。"""
    if task_type not in _OPERATE_TASK_TYPES:
        raise AppException(code=4000, message=f"不支持的操作类型: {task_type}", status_code=400)

    row = _get_deployment_or_404(db, deployment_id, actor)

    # 状态前置校验，避免重复操作
    if task_type == enums.TASK_TYPE_START and row.deploy_status == enums.DEPLOY_STATUS_RUNNING:
        raise AppException(code=4090, message="实例已在运行中，无需重复启动", status_code=409)
    if task_type == enums.TASK_TYPE_STOP and row.deploy_status == enums.DEPLOY_STATUS_STOPPED:
        raise AppException(code=4090, message="实例已停止，无需重复停止", status_code=409)

    task = McpDeployTask(
        capability_id=row.capability_id,
        version_id=row.version_id,
        task_type=task_type,
        task_status=enums.TASK_STATUS_PENDING,
        runtime_provider=enums.RUNTIME_PROVIDER_K8S,
        created_by=actor.id,
    )
    db.add(task)
    db.commit()
    db.refresh(task)

    return McpTaskCreated(
        task_id=task.id,
        task_type=task.task_type,
        task_status=task.task_status,
    )
