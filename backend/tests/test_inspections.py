"""Integration test suite for Waste Inspection API."""

import asyncio
from app.main import app


async def run_tests():
    print("--- Starting Waste Inspection API Tests ---")

    # Multipart Form Helper
    async def make_multipart_request(path: str, fields: dict, file_info: tuple):
        import uuid

        boundary = f"----WebKitFormBoundary{uuid.uuid4().hex}"
        body_parts = []

        # Add regular form fields
        for key, value in fields.items():
            body_parts.append(f"--{boundary}\r\n".encode("utf-8"))
            body_parts.append(
                f'Content-Disposition: form-data; name="{key}"\r\n\r\n'.encode(
                    "utf-8"
                )
            )
            body_parts.append(f"{value}\r\n".encode("utf-8"))

        # Add file
        field_name, filename, content_type, file_content = file_info
        body_parts.append(f"--{boundary}\r\n".encode("utf-8"))
        body_parts.append(
            f'Content-Disposition: form-data; name="{field_name}"; filename="{filename}"\r\n'.encode(
                "utf-8"
            )
        )
        body_parts.append(
            f"Content-Type: {content_type}\r\n\r\n".encode("utf-8")
        )
        body_parts.append(file_content)
        body_parts.append(b"\r\n")

        body_parts.append(f"--{boundary}--\r\n".encode("utf-8"))
        full_body = b"".join(body_parts)

        headers = [
            (
                b"content-type",
                f"multipart/form-data; boundary={boundary}".encode("utf-8"),
            )
        ]

        scope = {
            "type": "http",
            "asgi": {"version": "3.0"},
            "method": "POST",
            "path": path,
            "raw_path": path.encode("utf-8"),
            "query_string": b"",
            "headers": headers,
        }

        response_body = []
        status_code = None

        async def receive():
            nonlocal full_body
            data = full_body
            full_body = b""
            return {"type": "http.request", "body": data, "more_body": False}

        async def send(msg):
            nonlocal status_code
            if msg["type"] == "http.response.start":
                status_code = msg["status"]
            elif msg["type"] == "http.response.body":
                response_body.append(msg.get("body", b""))

        await app(scope, receive, send)
        import json

        parsed = json.loads(b"".join(response_body).decode("utf-8"))
        return status_code, parsed

    # Helper for JSON request (to register household first)
    async def make_json_request(method: str, path: str, json_data: dict = None):
        import json

        body_bytes = json.dumps(json_data).encode("utf-8") if json_data else b""
        headers = [(b"content-type", b"application/json")] if json_data else []

        scope = {
            "type": "http",
            "asgi": {"version": "3.0"},
            "method": method,
            "path": path,
            "raw_path": path.encode("utf-8"),
            "query_string": b"",
            "headers": headers,
        }

        response_body = []
        status_code = None

        async def receive():
            nonlocal body_bytes
            data = body_bytes
            body_bytes = b""
            return {"type": "http.request", "body": data, "more_body": False}

        async def send(msg):
            nonlocal status_code
            if msg["type"] == "http.response.start":
                status_code = msg["status"]
            elif msg["type"] == "http.response.body":
                response_body.append(msg.get("body", b""))

        await app(scope, receive, send)
        parsed = json.loads(b"".join(response_body).decode("utf-8"))
        return status_code, parsed

    # Step 1: Register test household
    print("1. Registering test household...")
    status, body = await make_json_request(
        "POST",
        "/api/v1/households/",
        {
            "name": "Inspection Test House",
            "address": "789 Segregation Blvd",
            "green_points": 0,
            "streak": 0,
        },
    )
    assert status == 201
    household_id = body["household_id"]
    print(f"   ✓ Created household ID: {household_id}")

    # Step 2: Perform Clean Segregated Inspection on POST /inspection
    print("2. Testing POST /inspection (Clean Segregated Wet Waste)...")
    status, body = await make_multipart_request(
        path="/inspection",
        fields={
            "household_id": household_id,
            "declared_waste_stream": "wet",
        },
        file_info=("file", "kitchen_waste.jpg", "image/jpeg", b"dummy_image_data"),
    )
    assert status == 201, f"Expected 201, got {status}: {body}"
    assert body["household_id"] == household_id
    assert body["is_segregated"] is True
    assert body["contamination_status"] == "clean"
    assert body["compliance_score"] == 95.0
    assert body["green_points_awarded"] == 20
    assert "timestamp" in body
    assert isinstance(body["detected_items"], list)
    print("   ✓ Inspection succeeded (Clean stream, 20 green points awarded).")

    # Step 3: Check updated household green points & streak
    print("3. Verifying household green points & streak updated...")
    status, hh_body = await make_json_request(
        "GET", f"/api/v1/households/{household_id}"
    )
    assert status == 200
    assert hh_body["green_points"] == 20
    assert hh_body["streak"] == 1
    print("   ✓ Household points increased to 20 and streak increased to 1.")

    # Step 4: Perform Contaminated Inspection
    print("4. Testing Contaminated Inspection (POST /api/v1/inspections/)...")
    status, body = await make_multipart_request(
        path="/api/v1/inspections/",
        fields={
            "household_id": household_id,
            "declared_waste_stream": "wet",
        },
        file_info=(
            "file",
            "contaminated_waste.jpg",
            "image/jpeg",
            b"dirty_waste_data",
        ),
    )
    assert status == 201, f"Expected 201, got {status}: {body}"
    assert body["is_segregated"] is False
    assert body["contamination_status"] == "contaminated"
    assert body["green_points_awarded"] == 0
    print("   ✓ Contaminated inspection correctly detected (0 green points awarded).")

    # Step 5: Test 404 Error for non-existent household
    print("5. Testing 404 Error for invalid household_id...")
    status, body = await make_multipart_request(
        path="/inspection",
        fields={
            "household_id": "hh_non_existent_999",
            "declared_waste_stream": "dry",
        },
        file_info=("file", "waste.jpg", "image/jpeg", b"data"),
    )
    assert status == 404, f"Expected 404, got {status}: {body}"
    print(f"   ✓ Received expected 404 error: {body['detail']}")

    # Step 6: Test 400 Bad Request for invalid stream
    print("6. Testing 400 Error for invalid declared_waste_stream...")
    status, body = await make_multipart_request(
        path="/inspection",
        fields={
            "household_id": household_id,
            "declared_waste_stream": "electronic",
        },
        file_info=("file", "waste.jpg", "image/jpeg", b"data"),
    )
    assert status == 400, f"Expected 400, got {status}: {body}"
    print(f"   ✓ Received expected 400 error: {body['detail']}")

    # Step 7: Fetch Inspection History for household
    print("7. Fetching inspection history for household...")
    status, history = await make_json_request(
        "GET", f"/api/v1/inspections/household/{household_id}"
    )
    assert status == 200
    assert len(history) == 2
    print(f"   ✓ Fetched inspection history: {len(history)} records found.")

    print("--- ALL WASTE INSPECTION API TESTS PASSED SUCCESSFULLY! ---")


if __name__ == "__main__":
    asyncio.run(run_tests())
