"""Unit & Integration Test Suite for AI Waste Classification Module."""

import asyncio
from app.services.ai_detection import ai_detection_service
from app.services.ai_inspection_service import ai_inspection_service
from app.main import app


def test_ai_detection_categories():
    print("--- Testing AIDetectionService Categories & Confidence ---")

    # 1. Clean Wet Waste
    res_wet = ai_detection_service.predict(declared_stream="wet", filename="organic_waste.jpg")
    assert res_wet.waste_category == "wet"
    assert res_wet.confidence_score >= 0.90
    assert res_wet.is_segregated is True
    assert res_wet.needs_review is False
    assert res_wet.prediction_source == "mock_fallback"
    print("   ✓ Wet category classification passed.")

    # 2. Recyclable Dry Waste
    res_dry = ai_detection_service.predict(declared_stream="dry", filename="cardboard_box.jpg")
    assert res_dry.waste_category == "recyclable"
    assert res_dry.confidence_score >= 0.90
    assert res_dry.is_segregated is True
    assert res_dry.needs_review is False
    print("   ✓ Recyclable category classification passed.")

    # 3. Hazardous Waste Detection
    res_hazard = ai_detection_service.predict(declared_stream="dry", filename="hazardous_battery.jpg")
    assert res_hazard.waste_category == "hazardous"
    assert res_hazard.is_segregated is False
    assert res_hazard.needs_review is True  # Hazardous waste always requires manual review
    print("   ✓ Hazardous waste detection & review flag passed.")

    # 4. Low Confidence / Blurry Image
    res_blur = ai_detection_service.predict(declared_stream="wet", filename="blurry_unclear_photo.jpg")
    assert res_blur.confidence_score < 0.65
    assert res_blur.needs_review is True  # Low confidence triggers manual review
    assert res_blur.contamination_status == "needs_review"
    print("   ✓ Low confidence image flagging passed.")


async def test_api_integration():
    print("--- Testing API Endpoint Integration with AI Metadata ---")
    import json

    # Register household
    body_bytes = json.dumps({"name": "AI Test Family", "address": "101 AI Lane"}).encode("utf-8")
    headers = [(b"content-type", b"application/json")]

    scope_reg = {
        "type": "http",
        "asgi": {"version": "3.0"},
        "method": "POST",
        "path": "/api/v1/households/",
        "raw_path": b"/api/v1/households/",
        "query_string": b"",
        "headers": headers,
    }

    res_body = []
    async def receive_reg():
        nonlocal body_bytes
        d = body_bytes
        body_bytes = b""
        return {"type": "http.request", "body": d}

    async def send_reg(msg):
        if msg["type"] == "http.response.body":
            res_body.append(msg.get("body", b""))

    await app(scope_reg, receive_reg, send_reg)
    hh = json.loads(b"".join(res_body).decode("utf-8"))
    hh_id = hh["household_id"]

    # Perform inspection
    boundary = "----WebKitFormBoundaryTestAI"
    multipart_parts = [
        f"--{boundary}\r\nContent-Disposition: form-data; name=\"household_id\"\r\n\r\n{hh_id}\r\n".encode(),
        f"--{boundary}\r\nContent-Disposition: form-data; name=\"declared_waste_stream\"\r\n\r\nwet\r\n".encode(),
        f"--{boundary}\r\nContent-Disposition: form-data; name=\"file\"; filename=\"waste.jpg\"\r\nContent-Type: image/jpeg\r\n\r\ndummy_image_data\r\n".encode(),
        f"--{boundary}--\r\n".encode(),
    ]
    mp_payload = b"".join(multipart_parts)

    scope_insp = {
        "type": "http",
        "asgi": {"version": "3.0"},
        "method": "POST",
        "path": "/inspection",
        "raw_path": b"/inspection",
        "query_string": b"",
        "headers": [(b"content-type", f"multipart/form-data; boundary={boundary}".encode())],
    }

    insp_body = []
    async def receive_insp():
        nonlocal mp_payload
        d = mp_payload
        mp_payload = b""
        return {"type": "http.request", "body": d}

    async def send_insp(msg):
        if msg["type"] == "http.response.body":
            insp_body.append(msg.get("body", b""))

    await app(scope_insp, receive_insp, send_insp)
    insp_res = json.loads(b"".join(insp_body).decode("utf-8"))

    assert "confidence_score" in insp_res
    assert "waste_category" in insp_res
    assert "needs_review" in insp_res
    assert "prediction_source" in insp_res
    print("   ✓ Inspection API returns all AI classification fields cleanly.")


if __name__ == "__main__":
    test_ai_detection_categories()
    asyncio.run(test_api_integration())
