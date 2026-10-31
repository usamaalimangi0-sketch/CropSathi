import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, DateTime
from app.database import Base

class PaymentRecord(Base):
    __tablename__ = "payments"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), nullable=False, index=True)
    plan_id = Column(String(50), nullable=False) # pro_monthly (PKR 499), kisan_season_pass (PKR 1999)
    amount_pkr = Column(Float, nullable=False)
    payment_gateway = Column(String(50), nullable=False) # easypaisa, jazzcash, sadapay, card
    account_number = Column(String(50), nullable=True)
    transaction_reference = Column(String(100), unique=True, index=True, nullable=False)
    status = Column(String(20), default="completed", nullable=False) # completed, pending, failed
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "plan_id": self.plan_id,
            "amount_pkr": self.amount_pkr,
            "payment_gateway": self.payment_gateway,
            "account_number": self.account_number,
            "transaction_reference": self.transaction_reference,
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
