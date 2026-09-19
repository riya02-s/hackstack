"""Household entity model."""

from dataclasses import dataclass, field
from datetime import datetime, timezone


@dataclass
class Household:
    household_id: str
    name: str
    address: str
    green_points: int = 0
    streak: int = 0
    created_at: str = field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat()
    )
