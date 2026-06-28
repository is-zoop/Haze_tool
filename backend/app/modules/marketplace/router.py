from __future__ import annotations

from pathlib import PurePosixPath
from typing import Annotated, Literal
from zipfile import BadZipFile, ZipFile

from fastapi import APIRouter, Depends, Query, Request
from sqlalchemy import func, or_, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.exceptions import AppException
from app.core.response import ApiResponse, success_response
from app.core.security import require_capabilities
from app.db.session import get_db
from app.modules.capabilities.models import Capability, CapabilityVersion
from app.modules.capabilities.storage import resolve_stored_file
from app.modules.marketplace.models import CapabilityFavorite
from app.modules.marketplace.schemas import FavoriteResult, MarketCapabilityData, MarketContentData, MarketListData, MarketVersionData
from app.modules.users.models import Department, User

router = APIRouter(prefix="/api/marketplace", tags=["marketplace"])

MARKET_CONTENT_FILES = {"quick_start.md", "README.md"}
MAX_MARKET_CONTENT_SIZE = 1024 * 1024


def _format_author(owner_name: str | None, department_name: str | None) -> str:
    if owner_name and department_name:
        return f"{owner_name} · {department_name}"
    return owner_name or department_name or ""


def _serialize_item(
    capability: Capability,
    owner_name: str | None,
    department_name: str | None,
    is_favorite: bool,
    version_history: list[MarketVersionData],
) -> MarketCapabilityData:
    extension = capability.extension_json or {}
    config = extension.get("config") or {}
    cap_type = "Skill" if capability.type == "skill" else "MCP"
    return MarketCapabilityData(
        id=str(capability.id),
        name=capability.name,
        type=cap_type,
        description=capability.description,
        version=capability.version,
        author=_format_author(owner_name, department_name),
        department=department_name,
        category=capability.category,
        connect_type=str(config.get("transport") or "HTTP").upper() if capability.type == "mcp" else None,
        version_history=version_history,
        tags=extension.get("tags", []),
        calls=int(extension.get("calls", 0)),
        is_favorite=is_favorite,
        icon=f"/api/developer/capabilities/{capability.id}/icon" if capability.icon else None,
        updated_at=capability.updated_at.strftime("%Y-%m-%d"),
    )


@router.get("/capabilities", response_model=ApiResponse[MarketListData])
def list_market_capabilities(
    request: Request,
    db: Annotated[Session, Depends(get_db)],
    actor: Annotated[User, Depends(require_capabilities("page.marketplace"))],
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=200),
    search: str = "",
    capability_type: Literal["skill", "mcp"] | None = Query(default=None, alias="type"),
    category: str | None = None,
    favorite_only: bool = False,
) -> ApiResponse[MarketListData]:
    base = [Capability.status == "published", Capability.deleted_at.is_(None)]

    if capability_type:
        base.append(Capability.type == capability_type)
    if category:
        base.append(Capability.category == category)
    if search.strip():
        term = f"%{search.strip()}%"
        base.append(or_(Capability.name.like(term), Capability.description.like(term)))

    if favorite_only:
        base.append(
            Capability.id.in_(
                select(CapabilityFavorite.capability_id).where(CapabilityFavorite.user_id == actor.id)
            )
        )

    total = db.scalar(select(func.count()).select_from(Capability).where(*base)) or 0

    rows = db.execute(
        select(Capability).where(*base).order_by(Capability.updated_at.desc()).offset((page - 1) * page_size).limit(page_size)
    ).scalars().all()

    if not rows:
        return success_response(request, MarketListData(items=[], page=page, page_size=page_size, total=total))

    capability_ids = [c.id for c in rows]
    owner_ids = list({c.owner_id for c in rows if c.owner_id})
    dept_ids = list({c.department_id for c in rows if c.department_id})

    owners: dict[int, str] = {}
    if owner_ids:
        for user in db.scalars(select(User).where(User.id.in_(owner_ids))).all():
            owners[user.id] = user.name

    depts: dict[int, str] = {}
    if dept_ids:
        for dept in db.scalars(select(Department).where(Department.id.in_(dept_ids))).all():
            depts[dept.id] = dept.name

    favorited: set[int] = set(
        db.scalars(
            select(CapabilityFavorite.capability_id).where(
                CapabilityFavorite.user_id == actor.id,
                CapabilityFavorite.capability_id.in_(capability_ids),
            )
        ).all()
    )

    versions_by_capability: dict[int, list[MarketVersionData]] = {capability_id: [] for capability_id in capability_ids}
    version_rows = db.scalars(
        select(CapabilityVersion)
        .where(CapabilityVersion.capability_id.in_(capability_ids))
        .order_by(CapabilityVersion.created_at.desc(), CapabilityVersion.id.desc())
    ).all()
    for version in version_rows:
        versions_by_capability[version.capability_id].append(
            MarketVersionData(
                version=version.version,
                created_at=version.created_at.isoformat(),
                changelog=version.changelog,
            )
        )

    items = [
        _serialize_item(
            c,
            owners.get(c.owner_id) if c.owner_id else None,
            depts.get(c.department_id) if c.department_id else None,
            c.id in favorited,
            versions_by_capability.get(c.id, []),
        )
        for c in rows
    ]

    return success_response(request, MarketListData(items=items, page=page, page_size=page_size, total=total))


def _read_market_content(capability: Capability, file_name: str) -> str | None:
    if file_name not in MARKET_CONTENT_FILES:
        return None
    package = (capability.extension_json or {}).get("package") or {}
    package_path = package.get("path")
    if not package_path:
        return None

    try:
        with ZipFile(resolve_stored_file(str(package_path))) as archive:
            candidates = [
                info
                for info in archive.infolist()
                if not info.is_dir()
                and PurePosixPath(info.filename).name.lower() == file_name.lower()
                and info.file_size <= MAX_MARKET_CONTENT_SIZE
            ]
            if not candidates:
                return None
            target = min(candidates, key=lambda info: len(PurePosixPath(info.filename).parts))
            return archive.read(target).decode("utf-8-sig")
    except (BadZipFile, UnicodeDecodeError, OSError):
        return None


@router.get("/capabilities/{capability_id}/content", response_model=ApiResponse[MarketContentData])
def get_market_content(
    capability_id: int,
    request: Request,
    db: Annotated[Session, Depends(get_db)],
    actor: Annotated[User, Depends(require_capabilities("page.marketplace"))],
    file_name: Literal["quick_start.md", "README.md"] = Query(alias="file"),
) -> ApiResponse[MarketContentData]:
    capability = db.scalar(
        select(Capability).where(
            Capability.id == capability_id,
            Capability.status == "published",
            Capability.deleted_at.is_(None),
        )
    )
    if capability is None:
        raise AppException(code=4042, message="Capability not found", status_code=404)
    return success_response(
        request,
        MarketContentData(file_name=file_name, content=_read_market_content(capability, file_name)),
    )


@router.post("/capabilities/{capability_id}/favorite", response_model=ApiResponse[FavoriteResult])
def toggle_favorite(
    capability_id: int,
    request: Request,
    db: Annotated[Session, Depends(get_db)],
    actor: Annotated[User, Depends(require_capabilities("page.marketplace"))],
) -> ApiResponse[FavoriteResult]:
    capability = db.scalar(
        select(Capability).where(
            Capability.id == capability_id,
            Capability.status == "published",
            Capability.deleted_at.is_(None),
        )
    )
    if capability is None:
        raise AppException(code=4042, message="Capability not found", status_code=404)

    existing = db.scalar(
        select(CapabilityFavorite).where(
            CapabilityFavorite.user_id == actor.id,
            CapabilityFavorite.capability_id == capability_id,
        )
    )
    if existing:
        db.delete(existing)
        db.commit()
        return success_response(request, FavoriteResult(is_favorite=False))

    try:
        db.add(CapabilityFavorite(user_id=actor.id, capability_id=capability_id))
        db.commit()
    except IntegrityError:
        db.rollback()
    return success_response(request, FavoriteResult(is_favorite=True))
