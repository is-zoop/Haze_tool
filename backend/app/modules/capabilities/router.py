from __future__ import annotations

from typing import Annotated, Literal

from fastapi import APIRouter, Depends, File, Query, Request, UploadFile
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.core.response import ApiResponse, success_response
from app.core.security import require_capabilities
from app.db.session import get_db
from app.modules.capabilities import service
from app.modules.capabilities.schemas import (
    CapabilityCreate,
    CapabilityData,
    CapabilityListData,
    CapabilityUpdate,
    CapabilityVersionCreate,
    CapabilityVersionListData,
    DeleteResult,
    TestStatusUpdate,
    UploadData,
)
from app.modules.capabilities.storage import create_upload
from app.modules.users.models import User

router = APIRouter(prefix="/api/developer", tags=["developer capabilities"])


@router.get("/capabilities", response_model=ApiResponse[CapabilityListData])
def list_capabilities(
    request: Request,
    db: Annotated[Session, Depends(get_db)],
    actor: Annotated[User, Depends(require_capabilities("capabilities.read"))],
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=10, ge=1, le=100),
    search: str = "",
    capability_type: Literal["skill", "mcp"] | None = Query(default=None, alias="type"),
    status: Literal["draft", "reviewing", "published", "offline"] | None = None,
) -> ApiResponse[CapabilityListData]:
    data = service.list_capabilities(
        db,
        actor,
        page=page,
        page_size=page_size,
        search=search,
        capability_type=capability_type,
        status=status,
    )
    return success_response(request, data)


@router.post("/uploads/icon", response_model=ApiResponse[UploadData])
async def upload_icon(
    request: Request,
    actor: Annotated[User, Depends(require_capabilities("capabilities.create"))],
    file: Annotated[UploadFile, File(...)],
) -> ApiResponse[UploadData]:
    metadata = await create_upload(file, kind="icon", actor_id=actor.id)
    return success_response(request, UploadData(
        upload_token=metadata["token"],
        kind="icon",
        file_name=metadata["file_name"],
        size=metadata["size"],
        expires_at=metadata["expires_at"],
    ))


@router.post("/uploads/package", response_model=ApiResponse[UploadData])
async def upload_package(
    request: Request,
    actor: Annotated[User, Depends(require_capabilities("capabilities.create"))],
    type: Annotated[Literal["skill", "mcp"], Query()],
    file: Annotated[UploadFile, File(...)],
) -> ApiResponse[UploadData]:
    metadata = await create_upload(file, kind="package", actor_id=actor.id, capability_type=type)
    return success_response(request, UploadData(
        upload_token=metadata["token"],
        kind="package",
        file_name=metadata["file_name"],
        size=metadata["size"],
        expires_at=metadata["expires_at"],
        files=metadata["files"],
        manifest=metadata["manifest"],
    ))


@router.post("/capabilities", response_model=ApiResponse[CapabilityData])
def create_capability(
    payload: CapabilityCreate,
    request: Request,
    db: Annotated[Session, Depends(get_db)],
    actor: Annotated[User, Depends(require_capabilities("capabilities.create"))],
) -> ApiResponse[CapabilityData]:
    return success_response(request, service.create_capability(db, actor, payload))


@router.get("/capabilities/{capability_id}", response_model=ApiResponse[CapabilityData])
def get_capability(
    capability_id: int,
    request: Request,
    db: Annotated[Session, Depends(get_db)],
    actor: Annotated[User, Depends(require_capabilities("capabilities.read"))],
) -> ApiResponse[CapabilityData]:
    return success_response(request, service.get_capability(db, capability_id, actor))


@router.get("/capabilities/{capability_id}/icon", response_class=FileResponse)
def get_capability_icon(
    capability_id: int,
    db: Annotated[Session, Depends(get_db)],
    actor: Annotated[User, Depends(require_capabilities("capabilities.read"))],
) -> FileResponse:
    path = service.get_capability_icon(db, capability_id, actor)
    return FileResponse(path)


@router.patch("/capabilities/{capability_id}", response_model=ApiResponse[CapabilityData])
def update_capability(
    capability_id: int,
    payload: CapabilityUpdate,
    request: Request,
    db: Annotated[Session, Depends(get_db)],
    actor: Annotated[User, Depends(require_capabilities("capabilities.update"))],
) -> ApiResponse[CapabilityData]:
    return success_response(request, service.update_capability(db, capability_id, actor, payload))


@router.get("/capabilities/{capability_id}/versions", response_model=ApiResponse[CapabilityVersionListData])
def list_versions(
    capability_id: int,
    request: Request,
    db: Annotated[Session, Depends(get_db)],
    actor: Annotated[User, Depends(require_capabilities("capabilities.read"))],
) -> ApiResponse[CapabilityVersionListData]:
    return success_response(request, service.list_versions(db, capability_id, actor))


@router.post("/capabilities/{capability_id}/versions", response_model=ApiResponse[CapabilityData])
def create_version(
    capability_id: int,
    payload: CapabilityVersionCreate,
    request: Request,
    db: Annotated[Session, Depends(get_db)],
    actor: Annotated[User, Depends(require_capabilities("capabilities.version"))],
) -> ApiResponse[CapabilityData]:
    return success_response(request, service.create_version(db, capability_id, actor, payload))


@router.post("/capabilities/{capability_id}/publish", response_model=ApiResponse[CapabilityData])
def publish_capability(
    capability_id: int,
    request: Request,
    db: Annotated[Session, Depends(get_db)],
    actor: Annotated[User, Depends(require_capabilities("capabilities.publish"))],
) -> ApiResponse[CapabilityData]:
    return success_response(request, service.publish_capability(db, capability_id, actor))


@router.post("/capabilities/{capability_id}/offline", response_model=ApiResponse[CapabilityData])
def offline_capability(
    capability_id: int,
    request: Request,
    db: Annotated[Session, Depends(get_db)],
    actor: Annotated[User, Depends(require_capabilities("capabilities.offline"))],
) -> ApiResponse[CapabilityData]:
    return success_response(request, service.offline_capability(db, capability_id, actor))


@router.patch("/capabilities/{capability_id}/test-status", response_model=ApiResponse[CapabilityData])
def update_test_status(
    capability_id: int,
    payload: TestStatusUpdate,
    request: Request,
    db: Annotated[Session, Depends(get_db)],
    actor: Annotated[User, Depends(require_capabilities("capabilities.test_result"))],
) -> ApiResponse[CapabilityData]:
    return success_response(request, service.update_test_status(db, capability_id, actor, payload))


@router.delete("/capabilities/{capability_id}", response_model=ApiResponse[DeleteResult])
def delete_capability(
    capability_id: int,
    request: Request,
    db: Annotated[Session, Depends(get_db)],
    actor: Annotated[User, Depends(require_capabilities("capabilities.delete"))],
) -> ApiResponse[DeleteResult]:
    service.delete_capability(db, capability_id, actor)
    return success_response(request, DeleteResult(deleted=True))