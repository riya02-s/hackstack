"""Abstract Base Repository for Household data access."""

from abc import ABC, abstractmethod
from typing import List, Optional
from app.models.household import Household


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
