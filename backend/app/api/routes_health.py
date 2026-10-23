from datetime import datetime, timezone
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.core.config import settings
from app.database import get_db

router = APIRouter(tags=["Health & Diagnostics"])

@router.get("/health")
def get_system_health(db: Session = Depends(get_db)):
    """System status and database connectivity check."""
    db_ok = False
    try:
        db.execute(text("SELECT 1"))
        db_ok = True
    except Exception:
        db_ok = False

    return {
        "status": "online" if db_ok else "degraded",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "database": "connected" if db_ok else "disconnected",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

@router.get("/health/ai")
def get_ai_status():
    """Returns AI model configuration status without exposing credentials."""
    configured = settings.is_gemini_configured()
    return {
        "ai_service": "Google Gemini Vision API",
        "model": settings.GEMINI_MODEL,
        "is_configured": configured,
        "status": "ready" if configured else "configuration_required",
        "instructions": (
            "Gemini API is ready for multimodal crop diagnosis."
            if configured else
            "Gemini API key is not yet set. Add your free key to backend/.env as GEMINI_API_KEY=AIzaSy... from https://aistudio.google.com/"
        )
    }
