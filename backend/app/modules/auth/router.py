from datetime import datetime, timezone
from typing import Annotated

from fastapi import APIRouter, Depends, Request
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.exceptions import AppException
from app.core.response import ApiResponse, success_response
from app.core.security import create_access_token, get_current_user, get_user_permission_codes, verify_password
from app.db.session import get_db
from app.modules.auth.schemas import AuthUser, LoginData, LoginRequest
from app.modules.users.models import User

router = APIRouter(prefix="/api/auth", tags=["auth"])


def serialize_auth_user(user: User) -> AuthUser:
    role = user.roles[0]
    return AuthUser(
        member_no=user.member_no,
        name=user.name,
        phone=user.phone,
        email=user.email,
        department=user.department.name,
        role_code=role.code,
        role_name=role.name,
        status=user.status,
        permissions=sorted(get_user_permission_codes(user)),
    )


@router.post("/login", response_model=ApiResponse[LoginData])
def login(payload: LoginRequest, request: Request, db: Annotated[Session, Depends(get_db)]) -> ApiResponse[LoginData]:
    user = db.scalar(select(User).where(User.phone == payload.phone, User.deleted == 0))
    if user is None or not verify_password(payload.password, user.password_hash):
        raise AppException(code=4011, message="Invalid phone number or password", status_code=401)
    if user.status != "active":
        raise AppException(code=4031, message="Account is disabled", status_code=403)
    permissions = sorted(get_user_permission_codes(user))
    token = create_access_token(
        user.member_no,
        roles=[role.code for role in user.roles],
        capabilities=permissions,
        token_version=user.token_version,
    )
    user.last_login_at = datetime.now(timezone.utc).replace(tzinfo=None)
    db.commit()
    settings = get_settings()
    return success_response(request, LoginData(
        access_token=token,
        expires_in=settings.jwt_access_token_expire_minutes * 60,
        user=serialize_auth_user(user),
    ))


@router.post("/logout", response_model=ApiResponse[dict[str, bool]])
def logout(request: Request, user: Annotated[User, Depends(get_current_user)], db: Annotated[Session, Depends(get_db)]) -> ApiResponse[dict[str, bool]]:
    user.token_version += 1
    db.commit()
    return success_response(request, {"logged_out": True})


@router.get("/me", response_model=ApiResponse[AuthUser])
def me(request: Request, user: Annotated[User, Depends(get_current_user)]) -> ApiResponse[AuthUser]:
    return success_response(request, serialize_auth_user(user))
