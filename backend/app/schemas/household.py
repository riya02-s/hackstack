"""Pydantic schemas for Household validation and serialization."""

from typing import Optional
from pydantic import BaseModel, Field, ConfigDict


class HouseholdBase(BaseModel):
    name: str = Field(
        ...,
        min_length=1,
        max_length=100,
        description="Name of the household or primary resident",
        examples=["Singla Residence"],
    )
    address: str = Field(
        ...,
        min_length=1,
        max_length=255,
        description="Physical street address",
        examples=["123 Eco Green Way, Sector 4"],
    )


class HouseholdCreate(HouseholdBase):
    green_points: Optional[int] = Field(
        default=0,
        ge=0,
        description="Initial green points earned by the household",
    )
    streak: Optional[int] = Field(
        default=0,
        ge=0,
        description="Initial waste separation streak count in days",
    )


class HouseholdResponse(BaseModel):
    household_id: str = Field(..., description="Unique identifier for the household")
    name: str
    address: str
    green_points: int = Field(..., ge=0)
    streak: int = Field(..., ge=0)
    created_at: str

    model_config = ConfigDict(from_attributes=True)


class HouseholdUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    address: Optional[str] = Field(None, min_length=1, max_length=255)
    green_points: Optional[int] = Field(None, ge=0)
    streak: Optional[int] = Field(None, ge=0)
