import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, DateTime
from app.database import Base

class DealerLeadRecord(Base):
    __tablename__ = "dealer_leads"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), nullable=True, index=True)
    dealer_id = Column(String(50), nullable=False, index=True)
    dealer_name = Column(String(200), nullable=False)
    district = Column(String(100), nullable=False)
    crop = Column(String(100), nullable=False)
    chemical_prescribed = Column(String(200), nullable=True)
    estimated_commission_pkr = Column(Float, default=100.0, nullable=False)
    status = Column(String(30), default="generated", nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "dealer_id": self.dealer_id,
            "dealer_name": self.dealer_name,
            "district": self.district,
            "crop": self.crop,
            "chemical_prescribed": self.chemical_prescribed,
            "estimated_commission_pkr": self.estimated_commission_pkr,
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
