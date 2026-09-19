"""Integration tests for Household API endpoints."""

import asyncio
from app.main import app


async def run_tests():
    print("--- Starting Household API Tests ---")

    # Helper for dispatching ASGI request
    async def make_request(method: str, path: str, json_data: dict = None):
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
        parsed_body = json.loads(b"".join(response_body).decode("utf-8"))
        return status_code, parsed_body

    # Test 1: Register a new household
    print("1. Testing Registration (POST /api/v1/households/)...")
    status, body = await make_request(
        "POST",
        "/api/v1/households/",
        {
            "name": "Green Eco Residence",
            "address": "456 Clean Street, Cityville",
            "green_points": 150,
            "streak": 5,
        },
    )
    assert status == 201, f"Expected 201, got {status}: {body}"
    assert "household_id" in body
    assert body["name"] == "Green Eco Residence"
    assert body["address"] == "456 Clean Street, Cityville"
    assert body["green_points"] == 150
    assert body["streak"] == 5
    household_id = body["household_id"]
    print(f"   ✓ Household registered successfully: ID = {household_id}")

    # Test 2: Fetch registered household details
    print(f"2. Testing Fetch Details (GET /api/v1/households/{household_id})...")
    status, body = await make_request("GET", f"/api/v1/households/{household_id}")
    assert status == 200, f"Expected 200, got {status}: {body}"
    assert body["household_id"] == household_id
    assert body["name"] == "Green Eco Residence"
    print("   ✓ Household details fetched successfully.")

    # Test 3: Fetch non-existent household (404 Error)
    print("3. Testing 404 Error for non-existent household...")
    status, body = await make_request("GET", "/api/v1/households/hh_nonexistent")
    assert status == 404, f"Expected 404, got {status}: {body}"
    assert "detail" in body
    print(f"   ✓ Received expected 404 error: {body['detail']}")

    # Test 4: Register household missing required field 'name' (422 Error)
    print("4. Testing 422 Validation Error (missing required 'name')...")
    status, body = await make_request(
        "POST",
        "/api/v1/households/",
        {
            "address": "Missing Name Street",
        },
    )
    assert status == 422, f"Expected 422, got {status}: {body}"
    print("   ✓ Received expected 422 validation error.")

    # Test 5: List all households
    print("5. Testing List Households (GET /api/v1/households/)...")
    status, body = await make_request("GET", "/api/v1/households/")
    assert status == 200, f"Expected 200, got {status}: {body}"
    assert isinstance(body, list)
    assert len(body) >= 1
    print(f"   ✓ Listed {len(body)} household(s).")

    print("--- ALL HOUSEHOLD API TESTS PASSED SUCCESSFULLY! ---")


if __name__ == "__main__":
    asyncio.run(run_tests())
