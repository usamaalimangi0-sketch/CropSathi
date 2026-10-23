from fastapi import APIRouter
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.gemini_service import gemini_service

router = APIRouter(prefix="/chat", tags=["Farming Assistant"])

@router.post("", response_model=ChatResponse)
def ask_farming_assistant(req: ChatRequest):
    """
    Conversational AI assistant answering farmer questions about crop care,
    pests, fertilizers, and irrigation in Pakistan in English or Urdu.
    """
    return gemini_service.chat_assistant(
        message=req.message,
        history=req.history,
        crop_context=req.crop_context,
        language=req.language
    )

@router.get("/health")
def get_chat_health():
    """Chat assistant availability check."""
    return {
        "status": "ready" if gemini_service._client is not None else "awaiting_api_key",
        "supported_languages": ["en (English)", "ur (اردو)"],
        "domain": "Agricultural & Crop Health Advisory for Pakistan"
    }
