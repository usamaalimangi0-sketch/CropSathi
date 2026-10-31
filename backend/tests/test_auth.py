import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_auth_registration_and_login_flow():
    test_phone = "03009988776"
    test_pw = "KisanPass123"
    
    # 1. Register a new farmer
    reg_res = client.post("/api/auth/register", json={
        "phone_or_email": test_phone,
        "full_name": "Muhammad Aslam",
        "password": test_pw,
        "district": "Sukkur, Sindh"
    })
    
    # Could be 201 or 400 if test already ran
    if reg_res.status_code == 201:
        data = reg_res.json()
        assert "access_token" in data
        assert data["user"]["full_name"] == "Muhammad Aslam"
        assert data["user"]["phone_or_email"] == test_phone
        token = data["access_token"]
    else:
        assert reg_res.status_code == 400
    
    # 2. Login with correct credentials
    login_res = client.post("/api/auth/login", json={
        "phone_or_email": test_phone,
        "password": test_pw
    })
    assert login_res.status_code == 200
    login_data = login_res.json()
    assert "access_token" in login_data
    token = login_data["access_token"]

    # 3. Test /me profile endpoint
    me_res = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_res.status_code == 200
    me_data = me_res.json()
    assert me_data["full_name"] == "Muhammad Aslam"
    assert me_data["phone_or_email"] == test_phone

    # 4. Test invalid login
    bad_login = client.post("/api/auth/login", json={
        "phone_or_email": test_phone,
        "password": "WrongPassword99"
    })
    assert bad_login.status_code == 401

def test_user_isolated_scan_history():
    import uuid
    from unittest.mock import patch
    import io
    from PIL import Image
    from app.schemas.diagnosis import CropDiagnosisResponse, DiagnosisInfo

    unique_phone = f"0300{uuid.uuid4().hex[:7]}"
    reg = client.post("/api/auth/register", json={
        "phone_or_email": unique_phone,
        "full_name": "Tariq Mahmood",
        "password": "FarmSecret123",
        "district": "Faisalabad, Punjab"
    })
    assert reg.status_code == 201
    user_token = reg.json()["access_token"]

    # Verify user's scan history is initially empty
    scans_res = client.get("/api/scans", headers={"Authorization": f"Bearer {user_token}"})
    assert scans_res.status_code == 200
    assert scans_res.json()["total"] == 0

    # Mock diagnose endpoint
    img = Image.new("RGB", (300, 300), color=(34, 139, 34))
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    leaf_bytes = buf.getvalue()

    with patch("app.services.gemini_service.gemini_service.analyze_crop_image") as mock_diag:
        mock_diag.return_value = CropDiagnosisResponse(
            crop="Rice",
            image_quality="good",
            plant_status="healthy",
            diagnosis=DiagnosisInfo(
                name="Healthy Rice Canopy",
                confidence=0.96,
                reasoning_summary="Vibrant green leaves with no lesions."
            ),
            symptoms=[],
            possible_causes=[],
            recommended_actions=["Maintain normal nitrogen scheduling"],
            prevention=["Scout for stem borer"],
            urgency="low",
            language="en"
        )
        diag_res = client.post(
            "/api/diagnose",
            files={"file": ("rice_leaf.jpg", io.BytesIO(leaf_bytes), "image/jpeg")},
            data={"crop": "Rice", "language": "en"},
            headers={"Authorization": f"Bearer {user_token}"}
        )
        assert diag_res.status_code == 200

    # User's history should now contain exactly 1 scan
    scans_res2 = client.get("/api/scans", headers={"Authorization": f"Bearer {user_token}"})
    assert scans_res2.status_code == 200
    assert scans_res2.json()["total"] == 1
    assert scans_res2.json()["items"][0]["crop"] == "Rice"
