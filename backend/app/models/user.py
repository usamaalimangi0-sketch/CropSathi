import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Boolean, DateTime, Integer
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
    
    # Monetization & Freemium Quota
    subscription_tier = Column(String(50), default="free", nullable=False) # free, pro_monthly, kisan_season_pass
    scans_used_this_month = Column(Integer, default=0, nullable=False)
    monthly_scan_limit = Column(Integer, default=3, nullable=False)
    subscription_expires_at = Column(DateTime, nullable=True)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    def is_pro(self) -> bool:
        if self.subscription_tier in ["pro_monthly", "kisan_season_pass"]:
            if self.subscription_expires_at:
                return datetime.now(timezone.utc) < self.subscription_expires_at.replace(tzinfo=timezone.utc) if self.subscription_expires_at.tzinfo is None else self.subscription_expires_at
            return True
        return False

    def to_dict(self):
        is_pro_user = self.is_pro()
        remaining = 99999 if is_pro_user else max(0, (self.monthly_scan_limit or 3) - (self.scans_used_this_month or 0))
        
        return {
            "id": self.id,
            "phone_or_email": self.phone_or_email,
            "full_name": self.full_name,
            "district": self.district or "Pakistan",
            "subscription_tier": self.subscription_tier or "free",
            "is_pro": is_pro_user,
            "scans_used": self.scans_used_this_month or 0,
            "monthly_limit": 99999 if is_pro_user else (self.monthly_scan_limit or 3),
            "scans_remaining": "Unlimited" if is_pro_user else remaining,
            "subscription_expires_at": self.subscription_expires_at.isoformat() if self.subscription_expires_at else None,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
