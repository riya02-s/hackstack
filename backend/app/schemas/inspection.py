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
    timestamp: str = Field(..., description="UTC ISO timestamp of inspection")

    model_config = ConfigDict(from_attributes=True)
