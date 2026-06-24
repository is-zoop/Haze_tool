from __future__ import annotations

from datetime import datetime

from sqlalchemy import BigInteger, DateTime, ForeignKey, Integer, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class CapabilityFavorite(Base):
    __tablename__ = "capability_favorites"
    __table_args__ = (
        UniqueConstraint("user_id", "capability_id", name="uq_capability_favorites_user_capability"),
        {"comment": "用户收藏能力表"},
    )

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True, comment="收藏ID")
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True, comment="收藏人用户ID"
    )
    capability_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("capabilities.id", ondelete="CASCADE"), nullable=False, index=True, comment="被收藏能力ID"
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, server_default=func.now(), comment="收藏时间"
    )
