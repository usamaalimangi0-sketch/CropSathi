from fastapi import APIRouter
from app.api.routes_health import router as health_router
from app.api.routes_auth import router as auth_router
from app.api.routes_diagnose import router as diagnose_router
from app.api.routes_scans import router as scans_router
from app.api.routes_chat import router as chat_router
from app.api.routes_irrigation import router as irrigation_router
from app.api.routes_payments import router as payments_router
from app.api.routes_dosage import router as dosage_router
from app.api.routes_enterprise import router as enterprise_router
from app.api.routes_whatsapp import router as whatsapp_router

api_router = APIRouter(prefix="/api")

api_router.include_router(health_router)
api_router.include_router(auth_router)
api_router.include_router(diagnose_router)
api_router.include_router(scans_router)
api_router.include_router(chat_router)
api_router.include_router(irrigation_router)
api_router.include_router(payments_router)
api_router.include_router(dosage_router)
api_router.include_router(enterprise_router)
api_router.include_router(whatsapp_router)

__all__ = ["api_router"]
