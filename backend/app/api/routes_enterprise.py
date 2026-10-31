import hashlib
import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, status
from app.schemas.monetization import (
    EnterpriseAssessmentRequest,
    EnterpriseAssessmentResponse
)

router = APIRouter(prefix="/enterprise", tags=["Enterprise Agri-Lending & Insurance"])

SEVERITY_RISK_MAP = {
    "low": (15, "A (Prime Field)", "Approved: Low agronomic default risk"),
    "moderate": (42, "B (Acceptable)", "Approved: Standard monitoring recommended"),
    "high": (78, "C (Substantial Risk)", "Conditional: Agronomic mitigation required before disbursement"),
    "critical": (92, "D (High Risk / Loss Claim)", "High Risk: Inspection required; Potential claim validation")
}

@router.post("/crop-health-assessment", response_model=EnterpriseAssessmentResponse)
def assess_crop_health_for_lending(payload: EnterpriseAssessmentRequest):
    """
    Generate an official CropSathi Health & Risk Assessment Certificate for
    microfinance banks (ZTBL, HBL, Khushhali) and provincial crop insurers.
    """
    severity_key = payload.severity.lower() if payload.severity else "moderate"
    risk_index, grade, recommendation = SEVERITY_RISK_MAP.get(
        severity_key, SEVERITY_RISK_MAP["moderate"]
    )

    cert_id = f"CS-CERT-{datetime.now(timezone.utc).strftime('%Y%m')}-{uuid.uuid4().hex[:6].upper()}"
    raw_hash_data = f"{cert_id}:{payload.farmer_phone}:{payload.district}:{payload.crop}:{risk_index}"
    verification_hash = hashlib.sha256(raw_hash_data.encode()).hexdigest()[:16].upper()

    return EnterpriseAssessmentResponse(
        certificate_id=cert_id,
        farmer_name=payload.farmer_name,
        district=payload.district,
        crop=payload.crop,
        field_risk_index_pct=risk_index,
        crop_health_grade=grade,
        loan_eligibility_recommendation=recommendation,
        loss_probability_pct=risk_index,
        verification_hash=verification_hash,
        timestamp=datetime.now(timezone.utc).isoformat()
    )
