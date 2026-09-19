"""Service layer for Household business logic."""

import uuid
from typing import List
from fastapi import HTTPException, status

from app.models.household import Household
from app.repositories.base import BaseHouseholdRepository
from app.schemas.household import HouseholdCreate, HouseholdResponse


class HouseholdService:
    """Encapsulates business operations and validation for Household entities."""

    def __init__(self, repository: BaseHouseholdRepository) -> None:
        self.repository = repository

    async def register_household(self, payload: HouseholdCreate) -> HouseholdResponse:
        """Register a new household with generated household_id."""
        household_id = f"hh_{uuid.uuid4().hex[:10]}"

        household = Household(
            household_id=household_id,
            name=payload.name.strip(),
            address=payload.address.strip(),
            green_points=payload.green_points or 0,
            streak=payload.streak or 0,
        )

        saved = await self.repository.save(household)
        return HouseholdResponse.model_validate(saved)

    async def get_household_by_id(self, household_id: str) -> HouseholdResponse:
        """Fetch household details by household_id or raise HTTP 404."""
        household = await self.repository.get_by_id(household_id)
        if not household:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Household with ID '{household_id}' was not found.",
            )
        return HouseholdResponse.model_validate(household)

    async def list_households(self) -> List[HouseholdResponse]:
        """Fetch all registered households."""
        households = await self.repository.list_all()
        return [HouseholdResponse.model_validate(hh) for hh in households]
