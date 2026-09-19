"""SQLite Repository implementation for persistent Household and Inspection storage."""

import json
import os
import sqlite3
from typing import List, Optional

from app.models.household import Household
from app.models.inspection import Inspection
from app.repositories.base import BaseHouseholdRepository, BaseInspectionRepository

# Database file location in backend directory
DB_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "waste_management.db")


def get_db_connection() -> sqlite3.Connection:
    """Creates a sqlite3 database connection with dict-like row factory."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_sqlite_db() -> None:
    """Initializes SQLite schema tables if they do not exist."""
    conn = get_db_connection()
    cursor = conn.cursor()

    # 1. Create Households table
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS households (
            household_id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            address TEXT NOT NULL,
            green_points INTEGER DEFAULT 0,
            streak INTEGER DEFAULT 0,
            created_at TEXT NOT NULL
        )
        """
    )

    # 2. Create Inspections table
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS inspections (
            inspection_id TEXT PRIMARY KEY,
            household_id TEXT NOT NULL,
            declared_waste_stream TEXT NOT NULL,
            image_filename TEXT NOT NULL,
            detected_items TEXT NOT NULL,
            is_segregated INTEGER NOT NULL,
            contamination_status TEXT NOT NULL,
            compliance_score REAL NOT NULL,
            green_points_awarded INTEGER NOT NULL,
            confidence_score REAL DEFAULT 0.90,
            waste_category TEXT DEFAULT 'wet',
            needs_review INTEGER DEFAULT 0,
            prediction_source TEXT DEFAULT 'image_content_analyzer_v1',
            timestamp TEXT NOT NULL,
            FOREIGN KEY (household_id) REFERENCES households (household_id)
        )
        """
    )

    conn.commit()
    conn.close()


# Ensure tables are initialized when module is imported
init_sqlite_db()


class SQLiteHouseholdRepository(BaseHouseholdRepository):
    """SQLite implementation of Household Repository."""

    async def save(self, household: Household) -> Household:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO households (household_id, name, address, green_points, streak, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
            ON CONFLICT(household_id) DO UPDATE SET
                name = excluded.name,
                address = excluded.address,
                green_points = excluded.green_points,
                streak = excluded.streak
            """,
            (
                household.household_id,
                household.name,
                household.address,
                household.green_points,
                household.streak,
                household.created_at,
            ),
        )
        conn.commit()
        conn.close()
        return household

    async def get_by_id(self, household_id: str) -> Optional[Household]:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT * FROM households WHERE household_id = ?", (household_id,)
        )
        row = cursor.fetchone()
        conn.close()

        if not row:
            return None

        return Household(
            household_id=row["household_id"],
            name=row["name"],
            address=row["address"],
            green_points=row["green_points"],
            streak=row["streak"],
            created_at=row["created_at"],
        )

    async def list_all(self) -> List[Household]:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM households ORDER BY created_at DESC")
        rows = cursor.fetchall()
        conn.close()

        return [
            Household(
                household_id=row["household_id"],
                name=row["name"],
                address=row["address"],
                green_points=row["green_points"],
                streak=row["streak"],
                created_at=row["created_at"],
            )
            for row in rows
        ]


class SQLiteInspectionRepository(BaseInspectionRepository):
    """SQLite implementation of Inspection Repository."""

    async def save(self, inspection: Inspection) -> Inspection:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO inspections (
                inspection_id, household_id, declared_waste_stream, image_filename,
                detected_items, is_segregated, contamination_status, compliance_score,
                green_points_awarded, confidence_score, waste_category, needs_review,
                prediction_source, timestamp
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(inspection_id) DO UPDATE SET
                household_id = excluded.household_id,
                declared_waste_stream = excluded.declared_waste_stream,
                image_filename = excluded.image_filename,
                detected_items = excluded.detected_items,
                is_segregated = excluded.is_segregated,
                contamination_status = excluded.contamination_status,
                compliance_score = excluded.compliance_score,
                green_points_awarded = excluded.green_points_awarded,
                confidence_score = excluded.confidence_score,
                waste_category = excluded.waste_category,
                needs_review = excluded.needs_review,
                prediction_source = excluded.prediction_source,
                timestamp = excluded.timestamp
            """,
            (
                inspection.inspection_id,
                inspection.household_id,
                inspection.declared_waste_stream,
                inspection.image_filename,
                json.dumps(inspection.detected_items),
                1 if inspection.is_segregated else 0,
                inspection.contamination_status,
                inspection.compliance_score,
                inspection.green_points_awarded,
                inspection.confidence_score,
                inspection.waste_category,
                1 if inspection.needs_review else 0,
                inspection.prediction_source,
                inspection.timestamp,
            ),
        )
        conn.commit()
        conn.close()
        return inspection

    async def get_by_id(self, inspection_id: str) -> Optional[Inspection]:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT * FROM inspections WHERE inspection_id = ?",
            (inspection_id,),
        )
        row = cursor.fetchone()
        conn.close()

        if not row:
            return None

        return Inspection(
            inspection_id=row["inspection_id"],
            household_id=row["household_id"],
            declared_waste_stream=row["declared_waste_stream"],
            image_filename=row["image_filename"],
            detected_items=json.loads(row["detected_items"]),
            is_segregated=bool(row["is_segregated"]),
            contamination_status=row["contamination_status"],
            compliance_score=float(row["compliance_score"]),
            green_points_awarded=int(row["green_points_awarded"]),
            confidence_score=float(row["confidence_score"]),
            waste_category=row["waste_category"],
            needs_review=bool(row["needs_review"]),
            prediction_source=row["prediction_source"],
            timestamp=row["timestamp"],
        )

    async def list_by_household(self, household_id: str) -> List[Inspection]:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT * FROM inspections WHERE household_id = ? ORDER BY timestamp DESC",
            (household_id,),
        )
        rows = cursor.fetchall()
        conn.close()

        return [
            Inspection(
                inspection_id=row["inspection_id"],
                household_id=row["household_id"],
                declared_waste_stream=row["declared_waste_stream"],
                image_filename=row["image_filename"],
                detected_items=json.loads(row["detected_items"]),
                is_segregated=bool(row["is_segregated"]),
                contamination_status=row["contamination_status"],
                compliance_score=float(row["compliance_score"]),
                green_points_awarded=int(row["green_points_awarded"]),
                confidence_score=float(row["confidence_score"]),
                waste_category=row["waste_category"],
                needs_review=bool(row["needs_review"]),
                prediction_source=row["prediction_source"],
                timestamp=row["timestamp"],
            )
            for row in rows
        ]
