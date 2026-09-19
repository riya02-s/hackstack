"""Health check endpoint module."""

from datetime import datetime, timezone
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class HealthResponse(BaseModel):
    status: str
    service: str
    version: str
    timestamp: str


@router.get(
    "/health",
    response_model=HealthResponse,
    summary="Health Check",
    description="Returns operational status of the backend API service.",
)
async def get_health() -> HealthResponse:
    return HealthResponse(
        status="healthy",
        service="Waste Management API",
        version="1.0.0",
        timestamp=datetime.now(timezone.utc).isoformat(),
    )
