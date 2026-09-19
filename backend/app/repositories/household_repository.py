"""In-memory implementation of Household repository."""

from typing import Dict, List, Optional
from app.models.household import Household
from app.repositories.base import BaseHouseholdRepository


class InMemoryHouseholdRepository(BaseHouseholdRepository):
    """Thread-safe in-memory store for Households.

    Easily replaceable with MongoHouseholdRepository for production MongoDB integration.
    """

    def __init__(self) -> None:
        self._store: Dict[str, Household] = {}

    async def save(self, household: Household) -> Household:
        self._store[household.household_id] = household
        return household

    async def get_by_id(self, household_id: str) -> Optional[Household]:
        return self._store.get(household_id)

    async def list_all(self) -> List[Household]:
        return list(self._store.values())


from app.repositories.sqlite_repository import SQLiteHouseholdRepository

# Persistent SQLite repository instance for Households
household_repository = SQLiteHouseholdRepository()

