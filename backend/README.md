# Waste Management Project - FastAPI Backend API

Production-ready FastAPI backend for the EcoClean Waste Management application, providing Household Management and AI-assisted Waste Segregation Inspection services.

---

## 📁 Directory & File Structure

```
backend/
├── .gitignore              # Ignores Python cache files (__pycache__), virtual environment (.venv/), and .env files
├── README.md               # Backend documentation and setup guide
├── requirements.txt        # Dependencies (FastAPI, Uvicorn, Pydantic, Python-Multipart)
├── app/
│   ├── __init__.py         # Application package initializer
│   ├── main.py             # FastAPI app entry point, Swagger UI setup, CORS middleware & root aliases
│   ├── api/
│   │   ├── __init__.py     # API package initializer
│   │   └── v1/
│   │       ├── __init__.py # API v1 package initializer
│   │       ├── router.py   # Router aggregating v1 endpoint sub-routers
│   │       └── endpoints/
│   │           ├── __init__.py
│   │           ├── health.py       # GET /api/v1/health
│   │           ├── households.py   # Household management endpoints
│   │           └── inspections.py  # Waste inspection endpoints
│   ├── core/
│   │   ├── __init__.py
│   │   └── config.py       # Application configuration & CORS settings
│   ├── models/
│   │   ├── household.py    # Household domain entity
│   │   └── inspection.py   # Inspection domain entity
│   ├── schemas/
│   │   ├── household.py    # Pydantic schemas for Household
│   │   └── inspection.py   # Pydantic schemas for Inspection
│   ├── repositories/
│   │   ├── base.py                 # Abstract base repositories
│   │   ├── household_repository.py # In-memory household repository
│   │   └── inspection_repository.py# In-memory inspection repository
│   └── services/
│       ├── household_service.py    # Household business logic
│       ├── ai_inspection_service.py# Mock computer vision AI model
│       └── inspection_service.py   # Inspection workflow service
└── tests/
    ├── test_households.py  # Household integration test suite
    └── test_inspections.py # Waste inspection test suite
```

---

## 🚀 Setup & Execution Instructions

### 1. Navigate to the backend directory

```bash
cd backend
```

### 2. Create a Virtual Environment

```bash
python3 -m venv .venv
```

### 3. Activate the Virtual Environment

- **macOS / Linux**:
  ```bash
  source .venv/bin/activate
  ```
- **Windows (PowerShell)**:
  ```powershell
  .venv\Scripts\Activate.ps1
  ```

### 4. Install Dependencies

```bash
pip install -r requirements.txt
```

### 5. Run the FastAPI Development Server

```bash
uvicorn app.main:app --reload --port 8000
```

---

## 🧪 Running Automated Tests

Run syntax checks and integration test suites:

```bash
# Syntax check across all files
.venv/bin/python -m py_compile app/main.py app/**/*.py tests/*.py

# Run integration tests
PYTHONPATH=. .venv/bin/python tests/test_households.py
PYTHONPATH=. .venv/bin/python tests/test_inspections.py
```

---

## 🌐 API Endpoints Overview

| Method | Endpoint | Description | Request Payload | Response |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/health` | Root health check | None | `200 OK` Status JSON |
| `POST` | `/api/v1/households/` | Register new household | JSON: `name`, `address` | `201 Created` Household JSON |
| `GET` | `/api/v1/households/{household_id}` | Fetch household details | None | `200 OK` / `404 Not Found` |
| `GET` | `/api/v1/households/` | List all households | None | `200 OK` List |
| `POST` | `/inspection` | Waste image inspection | Form Data: `household_id`, `declared_waste_stream`, `file` | `201 Created` Inspection JSON |
| `GET` | `/api/v1/inspections/household/{household_id}` | Inspection history | None | `200 OK` List |

---

## 📖 Swagger Documentation

Interactive OpenAPI documentation is available once the server is running on `http://localhost:8000`:

* **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
* **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)
* **OpenAPI Schema**: [http://localhost:8000/openapi.json](http://localhost:8000/openapi.json)
