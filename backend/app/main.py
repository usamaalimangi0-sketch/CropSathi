from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.logging import setup_logging, logger
from app.database import init_db
from app.api import api_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    setup_logging()
    logger.info("Starting CropSathi AI Backend Service...")
    init_db()
    if settings.is_gemini_configured():
        logger.info(f"Google Gemini AI service connected (Model: {settings.GEMINI_MODEL})")
    else:
        logger.warning("Google Gemini AI API key is not configured. Setup required in backend/.env")
    yield
    # Shutdown
    logger.info("Shutting down CropSathi AI Backend Service...")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Intelligent Agriculture Assistant for Pakistani Farmers",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include main API routes
app.include_router(api_router)

@app.get("/")
def read_root():
    return {
        "project": settings.PROJECT_NAME,
        "tagline": "Smart Farming. Healthier Crops. Better Decisions.",
        "region": "Pakistan",
        "docs_url": "/docs",
        "api_health": "/api/health",
        "ai_status": "/api/health/ai"
    }

# Safe error handling: ensure HTTPExceptions retain their status code and detail message
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail}
    )

@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    if isinstance(exc, HTTPException):
        return JSONResponse(
            status_code=exc.status_code,
            content={"detail": exc.detail}
        )
    logger.error(f"Unhandled error processing {request.method} {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred. Please try again shortly."}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=True)
