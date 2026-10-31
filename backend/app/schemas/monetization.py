from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

# --- Pillar A: Subscription & Payment Schemas ---
class SubscriptionPlan(BaseModel):
    id: str
    name: str
    urdu_name: str
    price_pkr: float
    duration: str
    scans_limit: str
    features: List[str]
    badge: Optional[str] = None

class SubscribePaymentRequest(BaseModel):
    plan_id: str = Field(..., description="Plan ID: pro_monthly or kisan_season_pass")
    payment_gateway: str = Field(..., description="Gateway: easypaisa, jazzcash, sadapay, or card")
    account_number: Optional[str] = Field(None, description="Mobile wallet number (e.g. 03001234567) or card last 4")

class SubscribePaymentResponse(BaseModel):
    success: bool
    message: str
    transaction_id: str
    plan_id: str
    amount_pkr: float
    subscription_expires_at: Optional[str] = None
    user_summary: Dict[str, Any]

# --- Pillar B: Dosage Calculator & B2B Leads ---
class DosageCalculatorRequest(BaseModel):
    crop: str = Field(..., description="Crop name (e.g. Wheat, Cotton, Rice)")
    disease_or_problem: str = Field(..., description="Detected disease or pest")
    land_size: float = Field(..., ge=0.1, le=1000.0, description="Size of farmland")
    land_unit: str = Field("acres", description="acres or kanals")

class DosageCalculatorResponse(BaseModel):
    crop: str
    problem: str
    land_size_acres: float
    chemical_active: str
    product_trade_name: str
    recommended_partner: str
    required_quantity_liters: float
    water_volume_liters: float
    sprayer_tanks_20l: int
    estimated_spray_cost_pkr: float
    instructions: List[str]

class LeadConnectRequest(BaseModel):
    dealer_id: str
    crop: str
    disease_name: str
    chemical_prescribed: Optional[str] = None

class LeadConnectResponse(BaseModel):
    success: bool
    lead_id: str
    dealer_name: str
    whatsapp_url: str
    phone: str
    message: str

# --- Pillar D: Agri-Lending & Crop Insurance (B2B/B2G) ---
class EnterpriseAssessmentRequest(BaseModel):
    farmer_name: str
    farmer_phone: str
    district: str
    crop: str
    field_size_acres: float
    observed_disease: Optional[str] = None
    severity: str = "moderate" # low, moderate, high, critical
    loan_requested_pkr: Optional[float] = None

class EnterpriseAssessmentResponse(BaseModel):
    certificate_id: str
    farmer_name: str
    district: str
    crop: str
    field_risk_index_pct: int # 0 to 100
    crop_health_grade: str # A (Prime), B (Acceptable), C (Moderate Risk), D (High Risk)
    loan_eligibility_recommendation: str # Approved, Conditional, High Risk
    loss_probability_pct: int
    verification_hash: str
    timestamp: str
