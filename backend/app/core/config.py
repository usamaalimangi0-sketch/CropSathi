import os
from typing import List
from dotenv import load_dotenv

# Load .env file from backend directory or parent
load_dotenv()

class Settings:
    PROJECT_NAME: str = "CropSathi AI"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"

    # Gemini AI
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "").strip()
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-flash-lite-latest").strip()

    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./cropsathi.db").strip()

    # CORS
    FRONTEND_ORIGIN: str = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173").strip()
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://localhost:8000",
        "*"  # Allows flexible testing during hackathon
    ]

    # File uploads
    MAX_UPLOAD_SIZE_MB: int = int(os.getenv("MAX_UPLOAD_SIZE_MB", "8"))
    MAX_UPLOAD_SIZE_BYTES: int = MAX_UPLOAD_SIZE_MB * 1024 * 1024

    # Server
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))

    @classmethod
    def is_gemini_configured(cls) -> bool:
        return bool(cls.GEMINI_API_KEY and len(cls.GEMINI_API_KEY) > 10 and not cls.GEMINI_API_KEY.startswith("replace_"))

settings = Settings()
