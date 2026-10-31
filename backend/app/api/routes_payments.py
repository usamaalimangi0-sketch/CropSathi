import uuid
from datetime import datetime, timedelta, timezone
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.payment import PaymentRecord
from app.core.security import get_current_user
from app.schemas.monetization import (
    SubscriptionPlan,
    SubscribePaymentRequest,
    SubscribePaymentResponse
)

router = APIRouter(prefix="/payments", tags=["Monetization & Payments"])

PLANS_CONFIG: List[SubscriptionPlan] = [
    SubscriptionPlan(
        id="free",
        name="Kisan Free",
        urdu_name="مفت کسان پلان",
        price_pkr=0.0,
        duration="Forever Free",
        scans_limit="3 Scans / Month",
        features=[
            "3 AI leaf disease diagnoses per month",
            "Basic district weather & Open-Meteo telemetry",
            "Standard irrigation guidelines",
            "English and Urdu interface",
            "Saved scan history (last 3 scans)"
        ]
    ),
    SubscriptionPlan(
        id="pro_monthly",
        name="Kisan Pro Monthly",
        urdu_name="پرو کسان (ماہانہ)",
        price_pkr=499.0,
        duration="1 Month (30 Days)",
        scans_limit="Unlimited Scans",
        badge="Most Popular",
        features=[
            "Unlimited Gemini Vision multimodal disease scans",
            "Exact fertilizer & spray dosage calculator per acre",
            "Priority Pakistani AI Agronomist chat in Urdu & English",
            "Personalized irrigation stress alerts for your district",
            "Full unlimited permanent farm diagnosis history",
            "Direct certified dealer WhatsApp support & discounts"
        ]
    ),
    SubscriptionPlan(
        id="kisan_season_pass",
        name="Kisan Season Harvest Pass",
        urdu_name="سیزن ہارویسٹ پاس (6 ماہ)",
        price_pkr=1999.0,
        duration="6 Months (Full Crop Cycle)",
        scans_limit="Unlimited Scans",
        badge="Best Value (Save 33%)",
        features=[
            "Full 6-month coverage for Wheat, Cotton or Rice harvest",
            "Unlimited AI Leaf Doctor diagnoses with zero restrictions",
            "Comprehensive spray dosage calculators & cost estimation",
            "Agri-lending & crop insurance health certificate generation",
            "Dedicated WhatsApp priority agronomic advice",
            "Early pest outbreak warnings for your district"
        ]
    )
]

@router.get("/plans", response_model=List[SubscriptionPlan])
def get_subscription_plans():
    """Retrieve all available farmer monetization plans."""
    return PLANS_CONFIG

@router.post("/subscribe", response_model=SubscribePaymentResponse)
def subscribe_to_plan(
    payload: SubscribePaymentRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Process payment subscription via Pakistani mobile wallets (EasyPaisa, JazzCash, SadaPay)
    or debit card, and activate Pro features immediately.
    """
    selected_plan = next((p for p in PLANS_CONFIG if p.id == payload.plan_id), None)
    if not selected_plan or selected_plan.id == "free":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid paid subscription plan selected."
        )

    # Calculate expiration date
    duration_days = 30 if payload.plan_id == "pro_monthly" else 180
    now_utc = datetime.now(timezone.utc)
    expires_at = now_utc + timedelta(days=duration_days)

    # Generate unique transaction reference (e.g. EP-2026-XXXX or JC-2026-XXXX)
    gateway_prefixes = {
        "easypaisa": "EP",
        "jazzcash": "JC",
        "sadapay": "SP",
        "card": "CARD"
    }
    prefix = gateway_prefixes.get(payload.payment_gateway.lower(), "TX")
    txn_ref = f"{prefix}-{now_utc.strftime('%Y%m%d')}-{uuid.uuid4().hex[:8].upper()}"

    # Record payment transaction
    payment = PaymentRecord(
        user_id=current_user.id,
        plan_id=payload.plan_id,
        amount_pkr=selected_plan.price_pkr,
        payment_gateway=payload.payment_gateway,
        account_number=payload.account_number or current_user.phone_or_email,
        transaction_reference=txn_ref,
        status="completed"
    )
    db.add(payment)

    # Upgrade User Subscription Tier
    current_user.subscription_tier = payload.plan_id
    current_user.monthly_scan_limit = 99999
    current_user.subscription_expires_at = expires_at
    db.commit()
    db.refresh(current_user)

    gateway_name = payload.payment_gateway.capitalize()
    return SubscribePaymentResponse(
        success=True,
        message=f"Mubarak! Successfully subscribed to {selected_plan.name} via {gateway_name}. Unlimited AI diagnostics activated.",
        transaction_id=txn_ref,
        plan_id=selected_plan.id,
        amount_pkr=selected_plan.price_pkr,
        subscription_expires_at=expires_at.isoformat(),
        user_summary=current_user.to_dict()
    )

@router.get("/history")
def get_payment_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve transaction history for the authenticated farmer."""
    records = db.query(PaymentRecord).filter(
        PaymentRecord.user_id == current_user.id
    ).order_by(PaymentRecord.created_at.desc()).all()
    return [r.to_dict() for r in records]
