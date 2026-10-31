from typing import Dict, Any, Optional
from fastapi import APIRouter, Request, Response, Query

router = APIRouter(prefix="/whatsapp", tags=["WhatsApp Bot & Telco Micro-Billing"])

OFFICIAL_WHATSAPP_BOT_NUMBER = "923001234567"

@router.get("/webhook")
def verify_whatsapp_webhook(
    hub_mode: Optional[str] = Query(None, alias="hub.mode"),
    hub_challenge: Optional[str] = Query(None, alias="hub.challenge"),
    hub_verify_token: Optional[str] = Query(None, alias="hub.verify_token")
):
    """Webhook verification endpoint for Meta WhatsApp Cloud API."""
    if hub_mode == "subscribe" and hub_verify_token == "cropsathi_bot_token_2026":
        return Response(content=hub_challenge, media_type="text/plain")
    return {"status": "CropSathi WhatsApp Bot Gateway is active"}

@router.post("/webhook")
async def handle_whatsapp_incoming(request: Request):
    """
    Handle incoming leaf photos and voice notes from Pakistani farmers on WhatsApp.
    Tracks scans for telco balance deduction (PKR 10/scan).
    """
    try:
        data = await request.json()
    except Exception:
        data = {}

    # In production, parses WhatsApp Cloud API webhook JSON payload
    return {
        "status": "received",
        "service": "CropSathi WhatsApp AI Agronomist",
        "telco_billing_event": {
            "rate_pkr": 10.0,
            "billing_type": "Direct Operator Billing (Jazz / Telenor / Zong)"
        }
    }

@router.get("/bot-info")
def get_whatsapp_bot_info():
    """Retrieve official WhatsApp bot connection link for UI."""
    sample_text = "Assalam-o-Alaikum CropSathi! I want to check my crop leaf disease."
    encoded = sample_text.replace(" ", "%20")
    
    return {
        "bot_number": f"+{OFFICIAL_WHATSAPP_BOT_NUMBER}",
        "whatsapp_url": f"https://wa.me/{OFFICIAL_WHATSAPP_BOT_NUMBER}?text={encoded}",
        "billing_model": "PKR 10 per scan or Free with Kisan Pro pass",
        "supported_languages": ["Urdu (اردو)", "English", "Sindhi (سنڌي)"]
    }
