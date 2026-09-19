"""Combined v1 API router."""

from fastapi import APIRouter
from app.api.v1.endpoints import health, households, inspections

api_router = APIRouter()
api_router.include_router(health.router, tags=["Health"])
api_router.include_router(households.router, prefix="/households", tags=["Households"])
api_router.include_router(inspections.router, prefix="/inspections", tags=["Inspections"])


