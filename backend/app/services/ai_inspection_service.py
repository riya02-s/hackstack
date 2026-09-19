import io
from typing import Dict, List, Optional, Tuple
from PIL import Image


class MockAIInspectionService:
    """Computer Vision & Image Content Analysis Service for Waste Inspection."""

    WET_CLEAN_ITEMS = ["vegetable_peels", "fruit_waste", "coffee_grounds", "eggshells"]
    WET_CONTAMINATED_ITEMS = ["vegetable_peels", "plastic_wrapper", "metal_can"]

    DRY_CLEAN_ITEMS = ["cardboard_box", "paper_packaging", "plastic_bottle", "aluminum_can"]
    DRY_CONTAMINATED_ITEMS = ["cardboard_box", "food_leftovers", "wet_tea_bag"]

    def analyze_image(
        self,
        declared_stream: str,
        filename: str,
        image_bytes: Optional[bytes] = None,
    ) -> Tuple[List[str], bool, str, float, int, float, str, bool, str]:
        """Analyzes waste image using Pillow pixel feature extraction or fallback rule engine.

        Returns:
            (detected_items, is_segregated, contamination_status, compliance_score, green_points_awarded, confidence_score, waste_category, needs_review, prediction_source)
        """
        clean_stream = declared_stream.strip().lower()

        # 1. Try PIL Image Pixel & Color Analysis if image_bytes provided
        if image_bytes and len(image_bytes) > 0:
            try:
                img = Image.open(io.BytesIO(image_bytes))
                img = img.convert("RGB")
                width, height = img.size

                # Resize for quick histogram & channel average calculation
                small_img = img.resize((50, 50))
                pixels = list(small_img.getdata())
                total_pixels = len(pixels)

                red_sum = sum(p[0] for p in pixels)
                green_sum = sum(p[1] for p in pixels)
                blue_sum = sum(p[2] for p in pixels)

                # Organic ratio: high green/brown channel component vs white/gray packaging
                organic_green_count = sum(1 for p in pixels if p[1] > p[0] and p[1] > p[2])
                bright_packaging_count = sum(1 for p in pixels if p[0] > 180 and p[1] > 180 and p[2] > 180)

                organic_ratio = organic_green_count / total_pixels
                packaging_ratio = bright_packaging_count / total_pixels

                if clean_stream == "wet":
                    # High packaging or synthetic brightness in wet waste indicates contamination
                    if packaging_ratio > 0.35:
                        return (
                            self.WET_CONTAMINATED_ITEMS,
                            False,
                            "contaminated",
                            42.0,
                            0,
                            0.88,
                            "wet",
                            True,
                            "image_content_analyzer_v1",
                        )
                    else:
                        return (
                            self.WET_CLEAN_ITEMS,
                            True,
                            "clean",
                            96.0,
                            20,
                            0.95,
                            "wet",
                            False,
                            "image_content_analyzer_v1",
                        )
                elif clean_stream == "dry":
                    # High organic green ratio in dry stream indicates wet waste contamination
                    if organic_ratio > 0.40:
                        return (
                            self.DRY_CONTAMINATED_ITEMS,
                            False,
                            "contaminated",
                            38.0,
                            0,
                            0.85,
                            "recyclable",
                            True,
                            "image_content_analyzer_v1",
                        )
                    else:
                        return (
                            self.DRY_CLEAN_ITEMS,
                            True,
                            "clean",
                            98.0,
                            25,
                            0.97,
                            "recyclable",
                            False,
                            "image_content_analyzer_v1",
                        )
            except Exception:
                # If image_bytes is not a valid graphic format (e.g. test dummy bytes), fallback below
                pass

        # 2. Fallback Rule Engine for simulation and testing
        lower_name = filename.lower()
        is_dirty = "contaminat" in lower_name or "dirty" in lower_name or "mixed" in lower_name

        if clean_stream == "wet":
            if is_dirty:
                detected = self.WET_CONTAMINATED_ITEMS
                is_segregated = False
                contamination = "contaminated"
                score = 40.0
                points = 0
                conf = 0.86
                needs_rev = True
            else:
                detected = self.WET_CLEAN_ITEMS
                is_segregated = True
                contamination = "clean"
                score = 95.0
                points = 20
                conf = 0.94
                needs_rev = False
            cat = "wet"
        elif clean_stream == "dry":
            if is_dirty:
                detected = self.DRY_CONTAMINATED_ITEMS
                is_segregated = False
                contamination = "contaminated"
                score = 35.0
                points = 0
                conf = 0.84
                needs_rev = True
            else:
                detected = self.DRY_CLEAN_ITEMS
                is_segregated = True
                contamination = "clean"
                score = 98.0
                points = 25
                conf = 0.96
                needs_rev = False
            cat = "recyclable"
        else:
            detected = ["unknown_item"]
            is_segregated = False
            contamination = "unclear"
            score = 50.0
            points = 0
            conf = 0.50
            needs_rev = True
            cat = "wet"

        return detected, is_segregated, contamination, score, points, conf, cat, needs_rev, "image_content_analyzer_v1"



ai_inspection_service = MockAIInspectionService()
