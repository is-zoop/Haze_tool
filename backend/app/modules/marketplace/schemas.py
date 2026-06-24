from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict


class StrictModel(BaseModel):
    model_config = ConfigDict(extra="forbid")


class MarketCapabilityData(StrictModel):
    id: str
    name: str
    type: str
    description: str | None
    version: str
    author: str
    department: str | None
    category: str | None
    tags: list[str]
    calls: int
    is_favorite: bool
    icon: str | None
    updated_at: str


class MarketListData(StrictModel):
    items: list[MarketCapabilityData]
    page: int
    page_size: int
    total: int


class FavoriteResult(StrictModel):
    is_favorite: bool
