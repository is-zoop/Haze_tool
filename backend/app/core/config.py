from __future__ import annotations

from functools import lru_cache
from pathlib import Path

from pydantic import Field, SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    app_name: str = "Haze Tool API"
    app_version: str = "0.1.0"
    environment: str = "development"
    debug: bool = False
    database_url: str = (
        "mysql+pymysql://haze:haze@127.0.0.1:3306/haze?charset=utf8mb4"
    )
    jwt_secret_key: SecretStr = SecretStr("change-me-in-production-use-32-bytes")
    jwt_algorithm: str = "HS256"
    jwt_access_token_expire_minutes: int = Field(default=30, ge=1)
    cors_origins: list[str] = Field(
        default_factory=lambda: [
            "http://localhost:3000",
            "http://127.0.0.1:3000",
        ]
    )
    local_storage_dir: Path = Path("./storage")


@lru_cache
def get_settings() -> Settings:
    return Settings()
