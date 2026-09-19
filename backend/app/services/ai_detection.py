"""AI Waste Classification Service module.

Provides waste stream recognition, item detection, category classification, confidence scoring,
needs_review flagging, and fallback simulation for waste management.
"""

from dataclasses import dataclass
from typing import List, Optional


@dataclass
class AIDetectionResult:
    """Structure representing output from the AI vision classification model."""

    detected_items: List[str]
    confidence_score: float  # Scale 0.0 to 1.0 (e.g. 0.95 = 95% confidence)
    waste_category: str  # "wet", "dry", "recyclable", "hazardous"
    is_segregated: bool
    contamination_status: str  # "clean", "contaminated", "needs_review"
    compliance_score: float  # 0.0 to 100.0
    green_points_awarded: int
    needs_review: bool  # Flagged True if confidence < 0.65 or ambiguous item
    prediction_source: str  # "mock_fallback" or "yolo_vision_v1"


class AIDetectionService:
    """AI Classification Engine with mock detection fallback and YOLO model expansion hooks."""

    CONFIDENCE_THRESHOLD: float = 0.65  # Below 65% triggers manual review flag

    def predict(
        self,
        declared_stream: str,
        filename: str = "waste.jpg",
        image_bytes: Optional[bytes] = None,
    ) -> AIDetectionResult:
        """Classifies an uploaded waste image.

        Note: Uses a mock fallback rule engine unless a real neural network (e.g. YOLO)
        is connected. Every output explicitly identifies its `prediction_source`.
        """
        # Hook for future YOLO / Neural Network integration
        if image_bytes and hasattr(self, "_model") and self._model is not None:
            return self._run_yolo_model(image_bytes, declared_stream)

        # Fallback heuristic engine
        return self._run_fallback_detection(declared_stream, filename)

    def _run_fallback_detection(
        self, declared_stream: str, filename: str
    ) -> AIDetectionResult:
        """Fallback detection logic for simulation and testing."""
        lower_name = filename.lower()
        clean_stream = declared_stream.strip().lower()

        # Case 1: Hazardous Waste (Batteries, Paint, E-waste, Medical)
        if any(kw in lower_name for kw in ["hazard", "battery", "chemical", "paint", "syringe"]):
            return AIDetectionResult(
                detected_items=["lithium_battery", "chemical_container"],
                confidence_score=0.91,
                waste_category="hazardous",
                is_segregated=False,
                contamination_status="contaminated",
                compliance_score=10.0,
                green_points_awarded=0,
                needs_review=True,  # Hazardous items always flagged for safety inspection
                prediction_source="mock_fallback",
            )

        # Case 2: Ambiguous / Low-Confidence Image (Blur, Unclear, Shadow)
        if any(kw in lower_name for kw in ["blur", "unclear", "uncertain", "dark", "shadow"]):
            return AIDetectionResult(
                detected_items=["unknown_object", "unclear_wrapper"],
                confidence_score=0.48,  # Below threshold
                waste_category=clean_stream if clean_stream in ("wet", "dry") else "wet",
                is_segregated=False,
                contamination_status="needs_review",
                compliance_score=50.0,
                green_points_awarded=0,
                needs_review=True,  # Low confidence triggers review
                prediction_source="mock_fallback",
            )

        # Case 3: Contaminated Waste (Mixed items)
        if any(kw in lower_name for kw in ["contaminat", "dirty", "mixed"]):
            if clean_stream == "wet":
                items = ["vegetable_peels", "plastic_wrapper", "metal_can"]
                cat = "wet"
            else:
                items = ["cardboard_box", "food_leftovers", "wet_tea_bag"]
                cat = "recyclable"

            return AIDetectionResult(
                detected_items=items,
                confidence_score=0.86,
                waste_category=cat,
                is_segregated=False,
                contamination_status="contaminated",
                compliance_score=40.0,
                green_points_awarded=0,
                needs_review=False,
                prediction_source="mock_fallback",
            )

        # Case 4: Clean Segregated Waste (Normal case)
        if clean_stream == "dry":
            return AIDetectionResult(
                detected_items=["cardboard_box", "paper_packaging", "plastic_bottle"],
                confidence_score=0.96,
                waste_category="recyclable",
                is_segregated=True,
                contamination_status="clean",
                compliance_score=98.0,
                green_points_awarded=25,
                needs_review=False,
                prediction_source="mock_fallback",
            )
        else:
            # Default Clean Wet Waste
            return AIDetectionResult(
                detected_items=["vegetable_peels", "fruit_waste", "coffee_grounds"],
                confidence_score=0.94,
                waste_category="wet",
                is_segregated=True,
                contamination_status="clean",
                compliance_score=95.0,
                green_points_awarded=20,
                needs_review=False,
                prediction_source="mock_fallback",
            )

    def _run_yolo_model(
        self, image_bytes: bytes, declared_stream: str
    ) -> AIDetectionResult:
        """Placeholder method for YOLO model inference.

        Example implementation with ultralytics YOLO:
            from ultralytics import YOLO
            import PIL.Image, io

            img = PIL.Image.open(io.BytesIO(image_bytes))
            results = self._model(img)
            # Parse bounding boxes, confidence scores, and class labels...
        """
        raise NotImplementedError("YOLO model integration requires loading trained weights.")


ai_detection_service = AIDetectionService()
