"""Main FastAPI application entry point."""

from datetime import datetime, timezone
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_router
from app.core.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    description=settings.PROJECT_DESCRIPTION,
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include v1 API endpoints under /api/v1
app.include_router(api_router, prefix=settings.API_V1_STR)


# Root level /health endpoint for direct health probing
@app.get(
    "/health",
    tags=["Health"],
    summary="Root Health Check",
    description="Check the operational health of the FastAPI backend service.",
)
async def root_health():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


from fastapi import status
from app.api.v1.endpoints.inspections import perform_inspection

app.post(
    "/inspection",
    status_code=status.HTTP_201_CREATED,
    tags=["Inspections"],
    summary="Root Inspection Alias",
    description="Alias endpoint for waste inspection (POST /inspection).",
)(perform_inspection)



@app.get(
    "/",
    tags=["Root"],
    summary="Root Index",
    description="Welcome endpoint directing users to API documentation.",
)
async def root():
    return {
        "message": f"Welcome to {settings.PROJECT_NAME}",
        "docs": "/docs",
        "health": "/health",
        "api_v1_health": f"{settings.API_V1_STR}/health",
        "inspection_endpoint": "/inspection",
    }

