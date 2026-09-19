"""Household API endpoint handlers."""

from typing import List
from fastapi import APIRouter, Depends, status

from app.repositories.household_repository import household_repository
from app.schemas.household import HouseholdCreate, HouseholdResponse
from app.services.household_service import HouseholdService

router = APIRouter()


def get_household_service() -> HouseholdService:
    """Dependency injector providing HouseholdService with standard repository."""
    return HouseholdService(repository=household_repository)


@router.post(
    "/",
    response_model=HouseholdResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new Household",
    description="Register a new household with name, address, green points, and streak.",
)
async def register_household(
    payload: HouseholdCreate,
    service: HouseholdService = Depends(get_household_service),
) -> HouseholdResponse:
    return await service.register_household(payload)


@router.get(
    "/{household_id}",
    response_model=HouseholdResponse,
    status_code=status.HTTP_200_OK,
    summary="Fetch Household details",
    description="Fetch registered household details by its unique household_id.",
)
async def get_household(
    household_id: str,
    service: HouseholdService = Depends(get_household_service),
) -> HouseholdResponse:
    return await service.get_household_by_id(household_id)


@router.get(
    "/",
    response_model=List[HouseholdResponse],
    status_code=status.HTTP_200_OK,
    summary="List all Households",
    description="Fetch a list of all registered households.",
)
async def list_households(
    service: HouseholdService = Depends(get_household_service),
) -> List[HouseholdResponse]:
    return await service.list_households()
