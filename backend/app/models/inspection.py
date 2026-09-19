"""Waste Inspection domain model."""

from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import List


@dataclass
class Inspection:
    inspection_id: str
    household_id: str
    declared_waste_stream: str  # "wet" or "dry"
    image_filename: str
    detected_items: List[str]
    is_segregated: bool
    contamination_status: str  # "clean", "contaminated", "needs_review"
    compliance_score: float  # 0.0 to 100.0
    green_points_awarded: int
    confidence_score: float = 0.90  # Scale 0.0 to 1.0 (e.g. 0.95 = 95%)
    waste_category: str = "wet"  # "wet", "dry", "recyclable", "hazardous"
    needs_review: bool = False  # Flagged True if confidence < 0.65 or ambiguous
    prediction_source: str = "mock_fallback"  # "mock_fallback" or "yolo_vision_v1"
    timestamp: str = field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat()
    )
