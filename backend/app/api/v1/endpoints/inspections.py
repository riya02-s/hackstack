"""Waste Inspection API endpoint handlers."""

from typing import List
from fastapi import APIRouter, Depends, File, Form, UploadFile, status

from app.repositories.household_repository import household_repository
from app.repositories.inspection_repository import inspection_repository
from app.schemas.inspection import InspectionResponse
from app.services.ai_inspection_service import ai_inspection_service
from app.services.inspection_service import InspectionService

router = APIRouter()


def get_inspection_service() -> InspectionService:
    """Dependency injection factory for InspectionService."""
    return InspectionService(
        household_repository=household_repository,
        inspection_repository=inspection_repository,
        ai_service=ai_inspection_service,
    )


@router.post(
    "/",
    response_model=InspectionResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Perform Waste Inspection",
    description="Upload a waste stream image for a household to evaluate segregation, compliance score, and green points.",
)
async def perform_inspection(
    household_id: str = Form(
        ..., description="ID of the household being inspected"
    ),
    declared_waste_stream: str = Form(
        ..., description="Declared stream type ('wet' or 'dry')"
    ),
    file: UploadFile = File(..., description="Uploaded image file of waste"),
    service: InspectionService = Depends(get_inspection_service),
) -> InspectionResponse:
    return await service.inspect_waste(
        household_id=household_id,
        declared_waste_stream=declared_waste_stream,
        image_file=file,
    )


@router.get(
    "/household/{household_id}",
    response_model=List[InspectionResponse],
    status_code=status.HTTP_200_OK,
    summary="Fetch Household Inspection History",
    description="Retrieve all past inspection records for a given household ID.",
)
async def get_household_inspections(
    household_id: str,
    service: InspectionService = Depends(get_inspection_service),
) -> List[InspectionResponse]:
    return await service.get_household_inspections(household_id)
