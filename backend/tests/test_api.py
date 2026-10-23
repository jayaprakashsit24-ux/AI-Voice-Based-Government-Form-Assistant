import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "VoiceGov Assist" in data["service"]

def test_list_forms():
    response = client.get("/api/forms")
    assert response.status_code == 200
    forms = response.json()
    assert len(forms) >= 5
    ids = [f["id"] for f in forms]
    assert "scholarship-demo" in ids
    assert "aadhaar-update-demo" in ids
    assert "pension-demo" in ids

def test_get_scholarship_form():
    response = client.get("/api/forms/scholarship-demo")
    assert response.status_code == 200
    form = response.json()
    assert form["title"] == "Government Scholarship Application"
    field_ids = [f["id"] for f in form["fields"]]
    assert "applicant_name" in field_ids
    assert "dob" in field_ids
    assert "mobile_number" in field_ids
    assert "annual_income" in field_ids

def test_voice_parse_name():
    payload = {
        "form_id": "scholarship-demo",
        "field_id": "applicant_name",
        "transcript": "My name is Jaya Prakash",
        "mode": "filling"
    }
    response = client.post("/api/assistant/parse", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["intent"] == "answer"
    assert data["extracted_value"] == "Jaya Prakash"
    assert data["is_valid"] is True
    assert "Jaya Prakash" in data["spoken_confirmation"]
    assert "Say yes or no" in data["spoken_confirmation"]

def test_voice_parse_valid_mobile():
    payload = {
        "form_id": "scholarship-demo",
        "field_id": "mobile_number",
        "transcript": "9876543210",
        "mode": "filling"
    }
    response = client.post("/api/assistant/parse", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["is_valid"] is True
    assert data["extracted_value"] == "9876543210"
    assert "ending in 3210" in data["spoken_confirmation"]

def test_voice_parse_invalid_mobile():
    payload = {
        "form_id": "scholarship-demo",
        "field_id": "mobile_number",
        "transcript": "12345",
        "mode": "filling"
    }
    response = client.post("/api/assistant/parse", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["is_valid"] is False
    assert "10 digits" in data["spoken_feedback"]

def test_voice_parse_date():
    payload = {
        "form_id": "scholarship-demo",
        "field_id": "dob",
        "transcript": "November 15 2006",
        "mode": "filling"
    }
    response = client.post("/api/assistant/parse", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["is_valid"] is True
    assert data["extracted_value"] == "2006-11-15"
    assert "November 15, 2006" in data["display_value"]

def test_voice_navigation_commands():
    # Repeat
    res = client.post("/api/assistant/parse", json={"transcript": "Repeat the question"})
    assert res.json()["intent"] == "repeat"

    # Go back
    res = client.post("/api/assistant/parse", json={"transcript": "Go back"})
    assert res.json()["intent"] == "go_back"

    # Skip
    res = client.post("/api/assistant/parse", json={"transcript": "Skip this field"})
    assert res.json()["intent"] == "skip"

    # Help
    res = client.post("/api/assistant/parse", json={"transcript": "Help me"})
    assert res.json()["intent"] == "help"

    # Submit
    res = client.post("/api/assistant/parse", json={"transcript": "I confirm and submit"})
    assert res.json()["intent"] == "submit"

def test_review_summary():
    payload = {
        "form_id": "scholarship-demo",
        "data": {
            "applicant_name": "Jaya Prakash",
            "dob": "2006-11-15",
            "gender": "Male",
            "mobile_number": "9876543210",
            "state": "Tamil Nadu",
            "district": "Coimbatore",
            "education_level": "Undergraduate",
            "annual_income": "150000",
            "scholarship_category": "Merit-cum-Means"
        }
    }
    response = client.post("/api/assistant/review", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["can_submit"] is True
    assert "Jaya Prakash" in data["spoken_summary"]
    assert "ending in 3210" in data["spoken_summary"]

def test_submission_flow():
    payload = {
        "form_id": "scholarship-demo",
        "data": {
            "applicant_name": "Jaya Prakash",
            "mobile_number": "9876543210"
        },
        "applicant_consent": True
    }
    response = client.post("/api/submissions", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["is_demo"] is True
    assert data["reference_number"].startswith("DEMO-SCH-")
    assert "Jaya Prakash" in data["spoken_receipt"]
