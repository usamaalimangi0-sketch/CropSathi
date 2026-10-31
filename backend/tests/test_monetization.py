import pytest
import uuid
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def get_test_farmer_token():
    unique_phone = f"0312{uuid.uuid4().hex[:7]}"
    res = client.post("/api/auth/register", json={
        "phone_or_email": unique_phone,
        "full_name": "Kisan Tariq",
        "password": "FarmPassword123",
        "district": "Sukkur, Sindh"
    })
    assert res.status_code == 201
    return res.json()["access_token"], unique_phone

def test_monetization_plans_endpoint():
    """Verify available subscription tiers in Pakistan."""
    res = client.get("/api/payments/plans")
    assert res.status_code == 200
    plans = res.json()
    assert len(plans) == 3
    plan_ids = [p["id"] for p in plans]
    assert "free" in plan_ids
    assert "pro_monthly" in plan_ids
    assert "kisan_season_pass" in plan_ids

def test_easypaisa_subscription_upgrade_flow():
    """Test subscribing to Kisan Pro Monthly via EasyPaisa mobile wallet."""
    token, phone = get_test_farmer_token()

    # Initial profile check (free tier)
    me_res = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_res.status_code == 200

    # Subscribe to Pro Monthly via EasyPaisa
    sub_res = client.post(
        "/api/payments/subscribe",
        json={
            "plan_id": "pro_monthly",
            "payment_gateway": "easypaisa",
            "account_number": phone
        },
        headers={"Authorization": f"Bearer {token}"}
    )
    assert sub_res.status_code == 200
    sub_data = sub_res.json()
    assert sub_data["success"] is True
    assert sub_data["amount_pkr"] == 499.0
    assert sub_data["user_summary"]["is_pro"] is True
    assert sub_data["user_summary"]["subscription_tier"] == "pro_monthly"
    assert "EP-" in sub_data["transaction_id"]

def test_dosage_calculator_and_dealer_leads():
    """Test spray dosage calculation per acre and B2B dealer lead generation."""
    # 1. Calculate dosage for 5 acres of wheat rust
    dosage_res = client.post("/api/dosage/calculate", json={
        "crop": "Wheat",
        "disease_or_problem": "Wheat Leaf Rust",
        "land_size": 5.0,
        "land_unit": "acres"
    })
    assert dosage_res.status_code == 200
    d_data = dosage_res.json()
    assert d_data["crop"] == "Wheat"
    assert d_data["water_volume_liters"] == 500.0 # 100L * 5
    assert d_data["sprayer_tanks_20l"] == 25 # 500 / 20
    assert d_data["estimated_spray_cost_pkr"] > 0

    # 2. Query nearby Sukkur dealers
    dealers_res = client.get("/api/dosage/dealers?district=Sukkur")
    assert dealers_res.status_code == 200
    dealers = dealers_res.json()
    assert len(dealers) > 0
    dealer_id = dealers[0]["id"]

    # 3. Connect lead to dealer
    token, _ = get_test_farmer_token()
    lead_res = client.post(
        "/api/dosage/leads",
        json={
            "dealer_id": dealer_id,
            "crop": "Wheat",
            "disease_name": "Wheat Leaf Rust",
            "chemical_prescribed": "Tebuconazole 250 EC"
        },
        headers={"Authorization": f"Bearer {token}"}
    )
    assert lead_res.status_code == 200
    lead_data = lead_res.json()
    assert lead_data["success"] is True
    assert "https://wa.me/" in lead_data["whatsapp_url"]

def test_enterprise_agri_lending_health_assessment():
    """Verify bank loan risk scoring certificate generation."""
    res = client.post("/api/enterprise/crop-health-assessment", json={
        "farmer_name": "Usama Ali",
        "farmer_phone": "03001234567",
        "district": "Sukkur, Sindh",
        "crop": "Cotton",
        "field_size_acres": 12.5,
        "observed_disease": "Cotton Leaf Curl Virus",
        "severity": "high",
        "loan_requested_pkr": 500000.0
    })
    assert res.status_code == 200
    cert = res.json()
    assert "CS-CERT-" in cert["certificate_id"]
    assert cert["field_risk_index_pct"] == 78
    assert "Substantial Risk" in cert["crop_health_grade"]
    assert cert["verification_hash"] is not None

def test_whatsapp_webhook_verification():
    """Verify WhatsApp Cloud API gateway."""
    res = client.get("/api/whatsapp/webhook?hub.mode=subscribe&hub.challenge=test_123&hub.verify_token=cropsathi_bot_token_2026")
    assert res.status_code == 200
    assert res.text == "test_123"
