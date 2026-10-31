import math
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.lead import DealerLeadRecord
from app.core.security import get_current_user_optional
from app.services.dealer_service import dealer_service, PAKISTAN_AGRI_DEALERS
from app.schemas.monetization import (
    DosageCalculatorRequest,
    DosageCalculatorResponse,
    LeadConnectRequest,
    LeadConnectResponse
)

router = APIRouter(prefix="/dosage", tags=["Dosage & Dealer Lead Generation"])

# Agronomic dosage database for Pakistani crops and common diseases
DOSAGE_GUIDE = {
    "wheat": {
        "chemical": "Tebuconazole 25.9% EC",
        "trade_name": "Folicur 250 EC / Engro Zorawar",
        "partner": "Bayer / Engro Crop Care",
        "rate_per_acre_ml": 250.0,
        "water_liters_per_acre": 100.0,
        "cost_per_acre_pkr": 1450.0,
        "instructions": [
            "Mix 250ml of formulation with 100 Liters of clean water per acre.",
            "Use hollow-cone nozzle to achieve thorough coverage of the wheat flag leaf.",
            "Spray during early morning or late afternoon when wind speed is under 10 km/h."
        ]
    },
    "cotton": {
        "chemical": "Diafenthiuron 500 SC + Acetamiprid",
        "trade_name": "Pegasus / FMC Talstar",
        "partner": "Syngenta / FMC Pakistan",
        "rate_per_acre_ml": 200.0,
        "water_liters_per_acre": 120.0,
        "cost_per_acre_pkr": 1850.0,
        "instructions": [
            "Target undersides of upper and middle cotton leaves where whiteflies colonize.",
            "Maintain 200-250 ml chemical in 120 liters of water per acre.",
            "Repeat after 10-14 days if ETL (Economic Threshold Level) exceeds 5 whiteflies/leaf."
        ]
    },
    "rice": {
        "chemical": "Isoprothiolane 40% EC",
        "trade_name": "Fuji-One / Kanzo Blast Care",
        "partner": "Nihon Nohyaku / Kanzo AG",
        "rate_per_acre_ml": 300.0,
        "water_liters_per_acre": 100.0,
        "cost_per_acre_pkr": 1600.0,
        "instructions": [
            "Apply at first appearance of spindle-shaped lesions on rice foliage.",
            "Ensure water level in the paddy field is maintained at 2-3 inches during application.",
            "Do not drain water for at least 48 hours following spray."
        ]
    },
    "default": {
        "chemical": "Mancozeb 75% WP Broad Spectrum Fungicide",
        "trade_name": "Dithane M-45 / Sona Protect",
        "partner": "Dow AgroSciences / FFC",
        "rate_per_acre_ml": 500.0,
        "water_liters_per_acre": 100.0,
        "cost_per_acre_pkr": 1200.0,
        "instructions": [
            "Dissolve 500g in 100 Liters of water per acre.",
            "Ensure full wetting of canopy, especially lower foliage.",
            "Wear protective mask and rubber gloves while preparing the spray solution."
        ]
    }
}

@router.post("/calculate", response_model=DosageCalculatorResponse)
def calculate_crop_dosage(payload: DosageCalculatorRequest):
    """
    Calculate exact chemical dosage, water volume, number of 20L sprayer tanks,
    and estimated cost in PKR for a given acreage.
    """
    # Normalize land size to acres (1 acre = 8 kanals)
    acres = payload.land_size if payload.land_unit.lower() == "acres" else payload.land_size / 8.0

    crop_key = payload.crop.lower().strip()
    guide = DOSAGE_GUIDE.get(crop_key, DOSAGE_GUIDE["default"])

    total_water = acres * guide["water_liters_per_acre"]
    total_chemical_ml = acres * guide["rate_per_acre_ml"]
    tanks_count = math.ceil(total_water / 20.0) # Standard 20L knapsack tank
    total_cost = round(acres * guide["cost_per_acre_pkr"], 2)

    return DosageCalculatorResponse(
        crop=payload.crop,
        problem=payload.disease_or_problem,
        land_size_acres=round(acres, 2),
        chemical_active=guide["chemical"],
        product_trade_name=guide["trade_name"],
        recommended_partner=guide["partner"],
        required_quantity_liters=round(total_chemical_ml / 1000.0, 2),
        water_volume_liters=round(total_water, 1),
        sprayer_tanks_20l=tanks_count,
        estimated_spray_cost_pkr=total_cost,
        instructions=guide["instructions"]
    )

@router.get("/dealers")
def get_nearby_dealers(district: Optional[str] = Query(None)):
    """Retrieve verified pesticide and fertilizer dealers near farmer's district."""
    return dealer_service.get_dealers_for_district(district)

@router.post("/leads", response_model=LeadConnectResponse)
def record_dealer_lead(
    payload: LeadConnectRequest,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """
    Record B2B lead generation event when farmer connects with a dealer
    to purchase recommended pesticides or fertilizers.
    """
    dealer = next((d for d in PAKISTAN_AGRI_DEALERS if d["id"] == payload.dealer_id), None)
    if not dealer:
        raise HTTPException(status_code=404, detail="Dealer not found.")

    lead = DealerLeadRecord(
        user_id=current_user.id if current_user else None,
        dealer_id=dealer["id"],
        dealer_name=dealer["name"],
        district=dealer["district"],
        crop=payload.crop,
        chemical_prescribed=payload.chemical_prescribed or "General Recommendation",
        estimated_commission_pkr=100.0,
        status="generated"
    )
    db.add(lead)
    db.commit()
    db.refresh(lead)

    # Format pre-filled WhatsApp message
    wa_msg = f"Assalam-o-Alaikum, I was referred by CropSathi AI. I need {payload.chemical_prescribed or 'certified spray'} for my {payload.crop} crop in {dealer['district']}."
    encoded_msg = wa_msg.replace(" ", "%20")
    whatsapp_url = f"https://wa.me/{dealer['whatsapp']}?text={encoded_msg}"

    return LeadConnectResponse(
        success=True,
        lead_id=lead.id,
        dealer_name=dealer["name"],
        whatsapp_url=whatsapp_url,
        phone=dealer["phone"],
        message=f"Connecting with {dealer['name']}. You can message them directly on WhatsApp or call."
    )
