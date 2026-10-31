import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, DateTime, JSON, Float
from app.database import Base

class ScanRecord(Base):
    __tablename__ = "scans"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), nullable=True, index=True)
    crop_type = Column(String(100), nullable=False, index=True)
    plant_status = Column(String(50), nullable=False, default="unclear")
    diagnosis_name = Column(String(255), nullable=True, index=True)
    confidence = Column(Float, nullable=True)
    analysis_summary = Column(Text, nullable=True)
    
    # Detailed diagnosis structured blocks
    symptoms = Column(JSON, nullable=True, default=list)
    possible_causes = Column(JSON, nullable=True, default=list)
    recommended_actions = Column(JSON, nullable=True, default=list)
    prevention = Column(JSON, nullable=True, default=list)
    
    urgency = Column(String(50), nullable=False, default="moderate")
    language = Column(String(10), nullable=False, default="en")
    
    # Store thumbnail data url or image path safely
    image_data = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False, index=True)

    def to_dict(self):
        return {
            "id": self.id,
            "crop": self.crop_type,
            "plant_status": self.plant_status,
            "diagnosis": {
                "name": self.diagnosis_name or "Healthy / Unspecified",
                "confidence": self.confidence,
                "reasoning_summary": self.analysis_summary or ""
            },
            "symptoms": self.symptoms or [],
            "possible_causes": self.possible_causes or [],
            "recommended_actions": self.recommended_actions or [],
            "prevention": self.prevention or [],
            "urgency": self.urgency or "moderate",
            "language": self.language or "en",
            "image_data": self.image_data,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
