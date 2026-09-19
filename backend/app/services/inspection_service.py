"""Inspection Service managing waste evaluation, household scoring, and history persistence."""

import uuid
from typing import List
from fastapi import HTTPException, status, UploadFile

from app.models.inspection import Inspection
from app.repositories.base import BaseHouseholdRepository
from app.repositories.inspection_repository import BaseInspectionRepository
from app.schemas.inspection import InspectionResponse
from app.services.ai_inspection_service import MockAIInspectionService


class InspectionService:
    """Orchestrates waste inspection workflow."""

    def __init__(
        self,
        household_repository: BaseHouseholdRepository,
        inspection_repository: BaseInspectionRepository,
        ai_service: MockAIInspectionService,
    ) -> None:
        self.household_repo = household_repository
        self.inspection_repo = inspection_repository
        self.ai_service = ai_service

    async def inspect_waste(
        self,
        household_id: str,
        declared_waste_stream: str,
        image_file: UploadFile,
    ) -> InspectionResponse:
        """Processes waste inspection for a household."""
        # 1. Validate Household Existence
        household = await self.household_repo.get_by_id(household_id)
        if not household:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Household with ID '{household_id}' does not exist.",
            )

        # 2. Validate Waste Stream Parameter
        clean_stream = declared_waste_stream.strip().lower()
        if clean_stream not in ("wet", "dry"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Declared waste stream must be either 'wet' or 'dry'.",
            )

        # 3. Read and Validate Image Binary Payload
        image_bytes = await image_file.read()
        if not image_bytes or len(image_bytes) == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Uploaded image file is empty or corrupted.",
            )

        filename = image_file.filename or "waste_image.jpg"
        (
            detected_items,
            is_segregated,
            contamination_status,
            compliance_score,
            green_points_awarded,
            confidence_score,
            waste_category,
            needs_review,
            prediction_source,
        ) = self.ai_service.analyze_image(clean_stream, filename, image_bytes)

        # 4. Construct Inspection Entity
        inspection_id = f"insp_{uuid.uuid4().hex[:10]}"
        inspection = Inspection(
            inspection_id=inspection_id,
            household_id=household_id,
            declared_waste_stream=clean_stream,
            image_filename=filename,
            detected_items=detected_items,
            is_segregated=is_segregated,
            contamination_status=contamination_status,
            compliance_score=compliance_score,
            green_points_awarded=green_points_awarded,
            confidence_score=confidence_score,
            waste_category=waste_category,
            needs_review=needs_review,
            prediction_source=prediction_source,
        )

        # 5. Persist Inspection History Record
        saved_inspection = await self.inspection_repo.save(inspection)

        # 6. Update Household Rewards (Green Points & Streak)
        if is_segregated:
            household.green_points += green_points_awarded
            household.streak += 1
        else:
            household.streak = 0  # Reset streak on non-segregated waste detection
        await self.household_repo.save(household)

        return InspectionResponse.model_validate(saved_inspection)

    async def get_household_inspections(
        self, household_id: str
    ) -> List[InspectionResponse]:
        """Fetches inspection history for a specific household."""
        household = await self.household_repo.get_by_id(household_id)
        if not household:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Household with ID '{household_id}' does not exist.",
            )

        records = await self.inspection_repo.list_by_household(household_id)
        return [InspectionResponse.model_validate(rec) for rec in records]
