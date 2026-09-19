"""Inspection Repository interface and in-memory implementation."""

from abc import ABC, abstractmethod
from typing import Dict, List, Optional
from app.models.inspection import Inspection


class BaseInspectionRepository(ABC):
    """Interface defining persistence operations for Inspection records."""

    @abstractmethod
    async def save(self, inspection: Inspection) -> Inspection:
        """Save a new inspection record."""
        pass

    @abstractmethod
    async def get_by_id(self, inspection_id: str) -> Optional[Inspection]:
        """Retrieve inspection record by unique ID."""
        pass

    @abstractmethod
    async def list_by_household(self, household_id: str) -> List[Inspection]:
        """Retrieve all inspections for a specific household."""
        pass


class InMemoryInspectionRepository(BaseInspectionRepository):
    """In-memory store for inspection records."""

    def __init__(self) -> None:
        self._store: Dict[str, Inspection] = {}

    async def save(self, inspection: Inspection) -> Inspection:
        self._store[inspection.inspection_id] = inspection
        return inspection

    async def get_by_id(self, inspection_id: str) -> Optional[Inspection]:
        return self._store.get(inspection_id)

    async def list_by_household(self, household_id: str) -> List[Inspection]:
        return [
            insp
            for insp in self._store.values()
            if insp.household_id == household_id
        ]


inspection_repository = InMemoryInspectionRepository()
