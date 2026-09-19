"""Application settings and configuration."""

from typing import List


class Settings:
    PROJECT_NAME: str = "Waste Management API"
    PROJECT_DESCRIPTION: str = (
        "Backend API for the Waste Management platform providing data "
        "and health status monitoring."
    )
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    # CORS origins permitted to make requests to this API
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:5173",  # Vite dev server default
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]


settings = Settings()
