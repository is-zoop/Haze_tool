from __future__ import annotations

from collections.abc import Callable, Sequence
from datetime import datetime, timedelta, timezone
from typing import Annotated, Any

import jwt
from fastapi import Depends, status
from fastapi.security import OAuth2PasswordBearer
from jwt import InvalidTokenError
from pwdlib import PasswordHash
from pydantic import BaseModel, ConfigDict, Field

from app.core.config import get_settings
from app.core.exceptions import AppException

password_hash = PasswordHash.recommended()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


class TokenPayload(BaseModel):
    model_config = ConfigDict(extra="allow")

    sub: str
    roles: list[str] = Field(default_factory=list)
    capabilities: list[str] = Field(default_factory=list)
    exp: datetime


def hash_password(password: str) -> str:
    return password_hash.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return password_hash.verify(plain_password, hashed_password)


def create_access_token(
    subject: str,
    *,
    roles: Sequence[str] = (),
    capabilities: Sequence[str] = (),
    expires_delta: timedelta | None = None,
    extra_claims: dict[str, Any] | None = None,
) -> str:
    settings = get_settings()
    expires_at = datetime.now(timezone.utc) + (
        expires_delta
        if expires_delta is not None
        else timedelta(minutes=settings.jwt_access_token_expire_minutes)
    )
    claims: dict[str, Any] = {
        "sub": subject,
        "roles": list(roles),
        "capabilities": list(capabilities),
        "exp": expires_at,
    }
    if extra_claims:
        claims.update(extra_claims)
    return jwt.encode(
        claims,
        settings.jwt_secret_key.get_secret_value(),
        algorithm=settings.jwt_algorithm,
    )


def decode_access_token(token: str) -> TokenPayload:
    settings = get_settings()
    try:
        payload = jwt.decode(
            token,
            settings.jwt_secret_key.get_secret_value(),
            algorithms=[settings.jwt_algorithm],
        )
        return TokenPayload.model_validate(payload)
    except (InvalidTokenError, ValueError) as exc:
        raise AppException(
            code=4010,
            message="invalid or expired token",
            status_code=status.HTTP_401_UNAUTHORIZED,
        ) from exc


def get_current_token_payload(
    token: Annotated[str, Depends(oauth2_scheme)],
) -> TokenPayload:
    return decode_access_token(token)


def require_capabilities(
    *required_capabilities: str,
) -> Callable[[TokenPayload], TokenPayload]:
    def capability_dependency(
        payload: Annotated[TokenPayload, Depends(get_current_token_payload)],
    ) -> TokenPayload:
        missing = set(required_capabilities) - set(payload.capabilities)
        if missing:
            raise AppException(
                code=4030,
                message="insufficient capabilities",
                status_code=status.HTTP_403_FORBIDDEN,
                data={"missing_capabilities": sorted(missing)},
            )
        return payload

    return capability_dependency
