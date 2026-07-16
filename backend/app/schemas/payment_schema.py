from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


# =====================================
# Create Payment Schema
# =====================================
class PaymentCreate(BaseModel):
    appointment_id: int = Field(
        ...,
        gt=0,
    )

    patient_id: int = Field(
        ...,
        gt=0,
    )

    amount: float = Field(
        ...,
        gt=0,
    )

    payment_method: str = Field(
        ...,
        min_length=2,
        max_length=30,
    )


# =====================================
# Complete Demo Payment Schema
# =====================================
class PaymentProcess(BaseModel):
    payment_successful: bool

    failure_reason: Optional[str] = Field(
        default=None,
        max_length=255,
    )


# =====================================
# Payment Response Schema
# =====================================
class PaymentResponse(BaseModel):
    id: int
    appointment_id: int
    patient_id: int
    amount: float
    currency: str
    payment_method: str
    payment_status: str
    transaction_id: str
    failure_reason: Optional[str] = None
    paid_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )