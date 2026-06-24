from __future__ import annotations

from copy import deepcopy
from datetime import datetime
from pathlib import Path
from typing import Any
from uuid import uuid4

from sqlalchemy import func, or_, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.exceptions import AppException
from app.core.rbac import ADMIN, SYSTEM_ADMIN
from app.modules.capabilities.models import Capability, CapabilityVersion
from app.modules.capabilities.schemas import (
    CapabilityCreate,
    CapabilityData,
    CapabilityListData,
    CapabilityUpdate,
    CapabilityVersionCreate,
    CapabilityVersionData,
    CapabilityVersionListData,
    TestStatusUpdate,
)
from app.modules.capabilities.storage import consume_upload, delete_capability_directory, delete_stored_files, peek_upload, resolve_stored_file
from app.modules.users.models import Department, User

ADMIN_ROLES = {SYSTEM_ADMIN, ADMIN}


def _is_admin(user: User) -> bool:
    return any(role.code in ADMIN_ROLES for role in user.roles)


def _normalize_version(version: str) -> str:
    return version.strip().removeprefix("v")


def _extension(capability: Capability) -> dict[str, Any]:
    return deepcopy(capability.extension_json or {})


def _snapshot(capability: Capability) -> dict[str, Any]:
    return {
        "code": capability.code,
        "name": capability.name,
        "type": capability.type,
        "description": capability.description,
        "category": capability.category,
        "icon": capability.icon,
        "version": capability.version,
        "status": capability.status,
        "visibility": capability.visibility,
        "owner_id": capability.owner_id,
        "department_id": capability.department_id,
        "extension_json": _extension(capability),
    }


def _serialize(
    db: Session,
    capability: Capability,
    *,
    owner_name: str | None = None,
    department_name: str | None = None,
) -> CapabilityData:
    extension = _extension(capability)
    if owner_name is None and capability.owner_id is not None:
        owner = db.get(User, capability.owner_id)
        owner_name = owner.name if owner else None
    if department_name is None and capability.department_id is not None:
        department = db.get(Department, capability.department_id)
        department_name = department.name if department else None
    return CapabilityData(
        id=capability.id,
        code=capability.code,
        name=capability.name,
        type=capability.type,
        description=capability.description,
        category=capability.category,
        icon=f"/api/developer/capabilities/{capability.id}/icon" if capability.icon else None,
        version=capability.version,
        status=capability.status,
        visibility=capability.visibility,
        owner_id=capability.owner_id,
        owner=owner_name,
        department_id=capability.department_id,
        department=department_name,
        tags=extension.get("tags", []),
        config=extension.get("config", {}),
        calls=int(extension.get("calls", 0)),
        recent_test_status=extension.get("recent_test_status", "none"),
        package=extension.get("package"),
        created_at=capability.created_at,
        updated_at=capability.updated_at,
    )


def _active_filters(actor: User) -> list[Any]:
    filters: list[Any] = [Capability.deleted_at.is_(None)]
    if not _is_admin(actor):
        filters.append(Capability.owner_id == actor.id)
    return filters


def _get_capability(db: Session, capability_id: int, actor: User) -> Capability:
    capability = db.scalar(select(Capability).where(Capability.id == capability_id, *_active_filters(actor)))
    if capability is None:
        raise AppException(code=4042, message="Capability not found", status_code=404)
    return capability


def _ensure_code_available(db: Session, code: str, *, exclude_id: int | None = None) -> None:
    statement = select(Capability.id).where(Capability.code == code)
    if exclude_id is not None:
        statement = statement.where(Capability.id != exclude_id)
    if db.scalar(statement) is not None:
        raise AppException(code=4092, message="Capability code already exists", status_code=409)


def list_capabilities(
    db: Session,
    actor: User,
    *,
    page: int,
    page_size: int,
    search: str,
    capability_type: str | None,
    status: str | None,
) -> CapabilityListData:
    base_filters = _active_filters(actor)
    filters = list(base_filters)
    if search.strip():
        term = f"%{search.strip()}%"
        filters.append(
            or_(
                Capability.code.like(term),
                Capability.name.like(term),
                Capability.description.like(term),
                Capability.category.like(term),
            )
        )
    if capability_type:
        filters.append(Capability.type == capability_type)
    if status:
        filters.append(Capability.status == status)

    total = db.scalar(select(func.count(Capability.id)).where(*filters)) or 0
    rows = db.execute(
        select(Capability, User.name, Department.name)
        .outerjoin(User, Capability.owner_id == User.id)
        .outerjoin(Department, Capability.department_id == Department.id)
        .where(*filters)
        .order_by(Capability.updated_at.desc(), Capability.id.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    ).all()
    counts = {
        "all": db.scalar(select(func.count(Capability.id)).where(*base_filters)) or 0,
        "draft": db.scalar(select(func.count(Capability.id)).where(*base_filters, Capability.status == "draft")) or 0,
        "reviewing": db.scalar(select(func.count(Capability.id)).where(*base_filters, Capability.status == "reviewing")) or 0,
        "published": db.scalar(select(func.count(Capability.id)).where(*base_filters, Capability.status == "published")) or 0,
        "offline": db.scalar(select(func.count(Capability.id)).where(*base_filters, Capability.status == "offline")) or 0,
        "skill": db.scalar(select(func.count(Capability.id)).where(*base_filters, Capability.type == "skill")) or 0,
        "mcp": db.scalar(select(func.count(Capability.id)).where(*base_filters, Capability.type == "mcp")) or 0,
    }
    return CapabilityListData(
        items=[_serialize(db, capability, owner_name=owner, department_name=department) for capability, owner, department in rows],
        page=page,
        page_size=page_size,
        total=total,
        counts=counts,
    )


def get_capability(db: Session, capability_id: int, actor: User) -> CapabilityData:
    return _serialize(db, _get_capability(db, capability_id, actor))


def get_capability_icon(db: Session, capability_id: int, actor: User) -> Path:
    capability = _get_capability(db, capability_id, actor)
    if not capability.icon:
        raise AppException(code=4045, message="Capability icon not found", status_code=404)
    return resolve_stored_file(capability.icon)


def list_versions(db: Session, capability_id: int, actor: User) -> CapabilityVersionListData:
    _get_capability(db, capability_id, actor)
    versions = db.scalars(
        select(CapabilityVersion)
        .where(CapabilityVersion.capability_id == capability_id)
        .order_by(CapabilityVersion.created_at.desc(), CapabilityVersion.id.desc())
    ).all()
    return CapabilityVersionListData(
        items=[
            CapabilityVersionData(
                id=item.id,
                capability_id=item.capability_id,
                version=item.version,
                snapshot=item.snapshot_json,
                changelog=item.changelog,
                created_by=item.created_by,
                created_at=item.created_at,
            )
            for item in versions
        ],
        total=len(versions),
    )


def create_capability(db: Session, actor: User, payload: CapabilityCreate) -> CapabilityData:
    _ensure_code_available(db, payload.code)
    package_upload = peek_upload(
        payload.package_upload_token,
        actor_id=actor.id,
        kind="package",
        capability_type=payload.type,
    )
    icon_upload = None
    if payload.icon_upload_token:
        icon_upload = peek_upload(payload.icon_upload_token, actor_id=actor.id, kind="icon")

    capability = Capability(
        code=payload.code,
        name=payload.name.strip(),
        type=payload.type,
        description=payload.description.strip() if payload.description else None,
        category=payload.category.strip() if payload.category else None,
        version=_normalize_version(payload.version),
        status="draft",
        visibility="internal",
        owner_id=actor.id,
        department_id=actor.department_id,
        created_by=actor.id,
        updated_by=actor.id,
        extension_json={
            "tags": payload.tags,
            "config": payload.config,
            "calls": 0,
            "recent_test_status": "none",
        },
    )
    created_paths: set[str] = set()
    try:
        db.add(capability)
        db.flush()
        extension = _extension(capability)
        package_path, package_meta = consume_upload(
            package_upload,
            destination=Path("capabilities") / str(capability.id) / "versions" / f"{capability.version}_{uuid4().hex}.zip",
        )
        created_paths.add(package_path)
        extension["package"] = package_meta
        if icon_upload:
            suffix = Path(icon_upload["file_name"]).suffix.lower()
            icon_path, icon_meta = consume_upload(
                icon_upload,
                destination=Path("capabilities") / str(capability.id) / "icons" / f"{uuid4().hex}{suffix}",
            )
            created_paths.add(icon_path)
            capability.icon = icon_path
            extension["icon"] = icon_meta
        capability.extension_json = extension
        db.add(
            CapabilityVersion(
                capability_id=capability.id,
                version=capability.version,
                snapshot_json=_snapshot(capability),
                changelog="Initial version",
                created_by=actor.id,
            )
        )
        db.commit()
        db.refresh(capability)
        return _serialize(db, capability)
    except IntegrityError as exc:
        db.rollback()
        delete_stored_files(created_paths)
        raise AppException(code=4092, message="Capability code or version already exists", status_code=409) from exc
    except Exception:
        db.rollback()
        delete_stored_files(created_paths)
        raise


def update_capability(
    db: Session,
    capability_id: int,
    actor: User,
    payload: CapabilityUpdate,
) -> CapabilityData:
    capability = _get_capability(db, capability_id, actor)
    values = payload.model_dump(exclude_unset=True)
    if "code" in values and values["code"] != capability.code:
        _ensure_code_available(db, values["code"], exclude_id=capability.id)

    icon_upload = None
    package_upload = None
    if values.get("icon_upload_token"):
        icon_upload = peek_upload(values["icon_upload_token"], actor_id=actor.id, kind="icon")
    if values.get("package_upload_token"):
        package_upload = peek_upload(
            values["package_upload_token"], actor_id=actor.id, kind="package", capability_type=capability.type
        )

    old_paths: set[str] = set()
    created_paths: set[str] = set()
    extension = _extension(capability)
    try:
        for field in ("code", "name", "description", "category", "visibility"):
            if field in values:
                value = values[field]
                setattr(capability, field, value.strip() if isinstance(value, str) else value)
        if "tags" in values:
            extension["tags"] = values["tags"]
        if "config" in values:
            extension["config"] = values["config"]
        if icon_upload:
            old_icon = capability.icon
            if old_icon:
                old_paths.add(old_icon)
            suffix = Path(icon_upload["file_name"]).suffix.lower()
            icon_path, icon_meta = consume_upload(
                icon_upload,
                destination=Path("capabilities") / str(capability.id) / "icons" / f"{uuid4().hex}{suffix}",
            )
            created_paths.add(icon_path)
            capability.icon = icon_path
            extension["icon"] = icon_meta
        if package_upload:
            package_path, package_meta = consume_upload(
                package_upload,
                destination=Path("capabilities") / str(capability.id) / "current" / f"{uuid4().hex}.zip",
            )
            created_paths.add(package_path)
            extension["package"] = package_meta
        capability.extension_json = extension
        capability.updated_by = actor.id
        db.commit()
        db.refresh(capability)
        delete_stored_files(old_paths)
        return _serialize(db, capability)
    except IntegrityError as exc:
        db.rollback()
        delete_stored_files(created_paths)
        raise AppException(code=4092, message="Capability code already exists", status_code=409) from exc
    except Exception:
        db.rollback()
        delete_stored_files(created_paths)
        raise


def create_version(
    db: Session,
    capability_id: int,
    actor: User,
    payload: CapabilityVersionCreate,
) -> CapabilityData:
    capability = _get_capability(db, capability_id, actor)
    if capability.status != "published":
        raise AppException(code=4093, message="Only published capabilities can create a version", status_code=409)
    version = _normalize_version(payload.version)
    if db.scalar(
        select(CapabilityVersion.id).where(
            CapabilityVersion.capability_id == capability.id,
            CapabilityVersion.version == version,
        )
    ) is not None:
        raise AppException(code=4094, message="Capability version already exists", status_code=409)
    if capability.type == "skill" and not payload.package_upload_token:
        raise AppException(code=4009, message="Skill version requires a ZIP package", status_code=400)

    package_upload = None
    if payload.package_upload_token:
        package_upload = peek_upload(
            payload.package_upload_token,
            actor_id=actor.id,
            kind="package",
            capability_type=capability.type,
        )
    created_paths: set[str] = set()
    try:
        extension = _extension(capability)
        if package_upload:
            package_path, package_meta = consume_upload(
                package_upload,
                destination=Path("capabilities") / str(capability.id) / "versions" / f"{version}_{uuid4().hex}.zip",
            )
            created_paths.add(package_path)
            extension["package"] = package_meta
        capability.version = version
        capability.status = "reviewing"
        capability.extension_json = extension
        capability.updated_by = actor.id
        db.add(
            CapabilityVersion(
                capability_id=capability.id,
                version=version,
                snapshot_json=_snapshot(capability),
                changelog=payload.changelog.strip(),
                created_by=actor.id,
            )
        )
        db.commit()
        db.refresh(capability)
        return _serialize(db, capability)
    except IntegrityError as exc:
        db.rollback()
        delete_stored_files(created_paths)
        raise AppException(code=4094, message="Capability version already exists", status_code=409) from exc
    except Exception:
        db.rollback()
        delete_stored_files(created_paths)
        raise


def publish_capability(db: Session, capability_id: int, actor: User) -> CapabilityData:
    capability = _get_capability(db, capability_id, actor)
    capability.status = "reviewing"
    capability.updated_by = actor.id
    extension = _extension(capability)
    extension["submitted_at"] = datetime.utcnow().isoformat()
    extension["submitted_by"] = actor.id
    capability.extension_json = extension
    db.commit()
    db.refresh(capability)
    return _serialize(db, capability)


def offline_capability(db: Session, capability_id: int, actor: User) -> CapabilityData:
    capability = _get_capability(db, capability_id, actor)
    if capability.status == "draft":
        raise AppException(code=4096, message="Draft capability cannot be taken offline", status_code=409)
    capability.status = "offline"
    capability.updated_by = actor.id
    db.commit()
    db.refresh(capability)
    return _serialize(db, capability)


def update_test_status(
    db: Session,
    capability_id: int,
    actor: User,
    payload: TestStatusUpdate,
) -> CapabilityData:
    capability = _get_capability(db, capability_id, actor)
    if capability.type != "mcp":
        raise AppException(code=4004, message="Skill capability does not require testing", status_code=400)
    extension = _extension(capability)
    extension["recent_test_status"] = payload.status
    capability.extension_json = extension
    capability.updated_by = actor.id
    db.commit()
    db.refresh(capability)
    return _serialize(db, capability)


def delete_capability(db: Session, capability_id: int, actor: User) -> None:
    capability = _get_capability(db, capability_id, actor)
    paths: set[str] = set()
    extension = _extension(capability)
    original_code = capability.code
    if capability.icon:
        paths.add(capability.icon)
    package = extension.get("package") or {}
    if package.get("path"):
        paths.add(package["path"])
    for version in capability.versions:
        snapshot_extension = (version.snapshot_json or {}).get("extension_json") or {}
        snapshot_package = snapshot_extension.get("package") or {}
        if snapshot_package.get("path"):
            paths.add(snapshot_package["path"])
        snapshot_icon = (version.snapshot_json or {}).get("icon")
        if snapshot_icon:
            paths.add(snapshot_icon)

    deleted_at = datetime.utcnow()
    extension["original_code"] = original_code
    extension["deleted_by"] = actor.id
    capability.extension_json = extension
    capability.code = f"{original_code[:45]}__deleted_{capability.id}_{int(deleted_at.timestamp())}"[:100]
    capability.deleted_at = deleted_at
    capability.updated_by = actor.id
    db.commit()
    delete_stored_files(paths)
    delete_capability_directory(capability.id)