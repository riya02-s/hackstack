"""Mock AI Computer Vision Service for Waste Inspection."""

from typing import Dict, List, Tuple


class MockAIInspectionService:
    """Simulates Computer Vision AI models for waste stream segregation & contamination detection."""

    WET_CLEAN_ITEMS = ["vegetable_peels", "fruit_waste", "coffee_grounds", "eggshells"]
    WET_CONTAMINATED_ITEMS = ["vegetable_peels", "plastic_wrapper", "metal_can"]

    DRY_CLEAN_ITEMS = ["cardboard_box", "paper_packaging", "plastic_bottle", "aluminum_can"]
    DRY_CONTAMINATED_ITEMS = ["cardboard_box", "food_leftovers", "wet_tea_bag"]

    def analyze_image(
        self, declared_stream: str, filename: str
    ) -> Tuple[List[str], bool, str, float, int]:
        """Analyzes waste image based on declared stream type.

        Returns:
            (detected_items, is_segregated, contamination_status, compliance_score, green_points_awarded)
        """
        lower_name = filename.lower()
        is_dirty = "contaminat" in lower_name or "dirty" in lower_name or "mixed" in lower_name

        if declared_stream.lower() == "wet":
            if is_dirty:
                detected = self.WET_CONTAMINATED_ITEMS
                is_segregated = False
                contamination = "contaminated"
                score = 40.0
                points = 0
            else:
                detected = self.WET_CLEAN_ITEMS
                is_segregated = True
                contamination = "clean"
                score = 95.0
                points = 20
        elif declared_stream.lower() == "dry":
            if is_dirty:
                detected = self.DRY_CONTAMINATED_ITEMS
                is_segregated = False
                contamination = "contaminated"
                score = 35.0
                points = 0
            else:
                detected = self.DRY_CLEAN_ITEMS
                is_segregated = True
                contamination = "clean"
                score = 98.0
                points = 25
        else:
            # Fallback for unrecognized stream
            detected = ["unknown_item"]
            is_segregated = False
            contamination = "unclear"
            score = 50.0
            points = 0

        return detected, is_segregated, contamination, score, points


ai_inspection_service = MockAIInspectionService()
