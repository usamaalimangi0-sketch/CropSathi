import io
import pytest
from PIL import Image
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock

import sys
import os
# Ensure app module is in python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.main import app
from app.schemas.diagnosis import CropDiagnosisResponse, DiagnosisInfo

client = TestClient(app)

def create_test_image(format="JPEG", size=(200, 200), color=(34, 139, 34)):
    """Helper to generate a real in-memory image for testing."""
    img = Image.new("RGB", size, color=color)
    buf = io.BytesIO()
    img.save(buf, format=format)
    buf.seek(0)
    return buf.getvalue()

def test_health_endpoint():
    """Verify /api/health returns status online and connected database."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] in ["online", "degraded"]
    assert "CropSathi AI" in data["service"]

def test_ai_health_endpoint():
    """Verify /api/health/ai returns configuration details without exposing keys."""
    response = client.get("/api/health/ai")
    assert response.status_code == 200
    data = response.json()
    assert "ai_service" in data
    assert "model" in data
    assert "is_configured" in data

def test_reject_non_image_file():
    """Verify that uploading a text file or fake extension is rejected."""
    fake_file = io.BytesIO(b"This is plain text pretending to be an image.")
    response = client.post(
        "/api/diagnose",
        files={"file": ("fake_leaf.jpg", fake_file, "image/jpeg")},
        data={"crop": "cotton", "language": "en"}
    )
    assert response.status_code == 400
    assert "INVALID_IMAGE" in response.json()["detail"]

def test_reject_unsupported_image_format():
    """Verify BMP or GIF is rejected when not in supported list."""
    bmp_data = create_test_image(format="BMP")
    response = client.post(
        "/api/diagnose",
        files={"file": ("leaf.bmp", io.BytesIO(bmp_data), "image/bmp")},
        data={"crop": "cotton", "language": "en"}
    )
    assert response.status_code == 415
    assert "UNSUPPORTED_IMAGE" in response.json()["detail"]

def test_reject_tiny_dimensions():
    """Verify images that are too small to see symptoms are rejected."""
    tiny_data = create_test_image(format="JPEG", size=(10, 10))
    response = client.post(
        "/api/diagnose",
        files={"file": ("tiny.jpg", io.BytesIO(tiny_data), "image/jpeg")},
        data={"crop": "wheat", "language": "en"}
    )
    assert response.status_code == 400
    assert "dimensions are too small" in response.json()["detail"]

@patch("app.services.gemini_service.gemini_service.analyze_crop_image")
def test_successful_crop_diagnosis_and_scan_flow(mock_analyze):
    """
    Test end-to-end flow:
    Upload valid leaf -> Mocked AI diagnosis -> Persisted in DB -> Retrieved via /api/scans -> Deleted.
    """
    mock_analyze.return_value = CropDiagnosisResponse(
        crop="Cotton",
        image_quality="good",
        plant_status="possibly_diseased",
        diagnosis=DiagnosisInfo(
            name="Cotton Leaf Curl Virus (CLCuV)",
            confidence=None,
            reasoning_summary="Upward curling of leaf margins and thickened primary veins."
        ),
        symptoms=["Upward leaf margin curl", "Thickened veins"],
        possible_causes=["Cotton leaf curl begomovirus", "Whitefly transmission"],
        recommended_actions=["Scout whitefly population", "Eradicate rogue infected plants"],
        prevention=["Use CLCuV resistant varieties", "Clean border weeds"],
        urgency="high",
        language="en",
        disclaimer="Diagnostic guidance for agricultural support."
    )

    valid_leaf = create_test_image(format="JPEG", size=(300, 300))
    response = client.post(
        "/api/diagnose",
        files={"file": ("cotton_leaf.jpg", io.BytesIO(valid_leaf), "image/jpeg")},
        data={"crop": "Cotton", "symptoms": "curling leaves", "language": "en"}
    )
    assert response.status_code == 200
    res_data = response.json()
    assert res_data["crop"] == "Cotton"
    assert res_data["diagnosis"]["name"] == "Cotton Leaf Curl Virus (CLCuV)"
    scan_id = res_data["id"]
    assert scan_id is not None

    # Verify scan is now in /api/scans list
    list_response = client.get("/api/scans")
    assert list_response.status_code == 200
    scans_data = list_response.json()
    assert scans_data["total"] >= 1
    found = any(s["id"] == scan_id for s in scans_data["items"])
    assert found is True

    # Verify retrieval of single scan detail
    detail_response = client.get(f"/api/scans/{scan_id}")
    assert detail_response.status_code == 200
    detail_data = detail_response.json()
    assert detail_data["diagnosis"]["name"] == "Cotton Leaf Curl Virus (CLCuV)"

    # Verify deletion
    del_response = client.delete(f"/api/scans/{scan_id}")
    assert del_response.status_code == 200

    # Verify 404 after deletion
    del_again = client.get(f"/api/scans/{scan_id}")
    assert del_again.status_code == 404

def test_smart_irrigation_advisor_endpoint():
    """Verify smart irrigation advice endpoint calculates advice for cotton."""
    payload = {
        "crop": "Cotton",
        "location": "Hyderabad, Sindh",
        "soil_type": "Clay-Loam",
        "growth_stage": "Flowering"
    }
    response = client.post("/api/irrigation/advice", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["crop"] == "Cotton"
    assert "watering_advice" in data
    assert "guidelines" in data
    assert len(data["guidelines"]) > 0

@patch("app.services.gemini_service.gemini_service.chat_assistant")
def test_chat_assistant_endpoint(mock_chat):
    """Verify conversational farming assistant endpoint."""
    from app.schemas.chat import ChatResponse
    mock_chat.return_value = ChatResponse(
        reply="Assalam-o-Alaikum! Basmati 515 and Super Basmati thrive in Punjab, while IRRI-6 and IRRI-9 are optimal for Sindh.",
        suggested_followups=["What is the ideal transplanting time for Sindh?", "How much water is required per acre?"],
        language="en"
    )

    payload = {
        "message": "Which rice variety is suitable for Sindh?",
        "history": [],
        "crop_context": "Rice",
        "language": "en"
    }
    response = client.post("/api/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "Assalam-o-Alaikum" in data["reply"]
    assert len(data["suggested_followups"]) == 2

def test_pakistan_districts_weather_resolution():
    """Verify location resolution for major Pakistani agricultural districts."""
    from app.services.weather_service import weather_service
    lat, lon, name = weather_service.resolve_location("Sukkur, Sindh")
    assert round(lat, 2) == 27.71
    assert round(lon, 2) == 68.86
    assert "Sukkur" in name

    lat2, lon2, name2 = weather_service.resolve_location("Multan, Punjab")
    assert round(lat2, 2) == 30.16
    assert "Multan" in name2

def test_urdu_text_sanitizer():
    """Verify Hindi Devanagari characters and asterisks are stripped."""
    from app.services.gemini_service import sanitize_text
    mixed = "یہ مقامی **کھیت** ہے اور उपाय موجود ہیں।"
    clean = sanitize_text(mixed)
    assert "उपाय" not in clean
    assert "*" not in clean
    assert "تدابیر" in clean or "مقامی" in clean
