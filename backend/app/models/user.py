import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Boolean, DateTime
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    phone_or_email = Column(String(100), unique=True, index=True, nullable=False)
    full_name = Column(String(100), nullable=False)
    district = Column(String(100), nullable=True, default="Sukkur, Sindh")
    hashed_password = Column(String(255), nullable=False)
    salt = Column(String(64), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "phone_or_email": self.phone_or_email,
            "full_name": self.full_name,
            "district": self.district or "Pakistan",
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
