"""Abstract Base Repository for Household data access."""

from abc import ABC, abstractmethod
from typing import List, Optional
from app.models.household import Household
from app.models.inspection import Inspection


class BaseHouseholdRepository(ABC):
    """Abstract interface defining standard CRUD operations for Household persistence."""

    @abstractmethod
    async def save(self, household: Household) -> Household:
        """Persist a new or updated Household entity."""
        pass

    @abstractmethod
    async def get_by_id(self, household_id: str) -> Optional[Household]:
        """Retrieve a Household entity by its unique ID."""
        pass

    @abstractmethod
    async def list_all(self) -> List[Household]:
        """Retrieve all registered Household entities."""
        pass


class BaseInspectionRepository(ABC):
    """Abstract interface defining persistence operations for Inspection records."""

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

