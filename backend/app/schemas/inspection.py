"""Pydantic schemas for Waste Inspection requests and responses."""

from typing import List
from pydantic import BaseModel, Field, ConfigDict


class InspectionResponse(BaseModel):
    inspection_id: str = Field(..., description="Unique inspection transaction ID")
    household_id: str = Field(..., description="Target household ID")
    declared_waste_stream: str = Field(
        ..., description="Declared stream type ('wet' or 'dry')"
    )
    image_filename: str = Field(..., description="Original name of uploaded image")
    detected_items: List[str] = Field(
        ..., description="List of items recognized by AI vision model"
    )
    is_segregated: bool = Field(
        ..., description="True if waste stream is cleanly segregated"
    )
    contamination_status: str = Field(
        ..., description="Segregation status: 'clean' or 'contaminated'"
    )
    compliance_score: float = Field(
        ..., ge=0.0, le=100.0, description="Compliance score percentage (0-100%)"
    )
    green_points_awarded: int = Field(
        ..., ge=0, description="Green points earned for this inspection"
    )
    confidence_score: float = Field(
        default=0.90, ge=0.0, le=1.0, description="Confidence score scale 0.0 to 1.0"
    )
    waste_category: str = Field(
        default="wet", description="Categorized stream: 'wet', 'dry', 'recyclable', 'hazardous'"
    )
    needs_review: bool = Field(
        default=False, description="Flagged True if confidence < 0.65 or ambiguous"
    )
    prediction_source: str = Field(
        default="image_content_analyzer_v1", description="Classification source engine"
    )
    timestamp: str = Field(..., description="UTC ISO timestamp of inspection")

    model_config = ConfigDict(from_attributes=True)

