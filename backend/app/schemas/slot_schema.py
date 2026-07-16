from datetime import date, time
from enum import Enum
from typing import Optional

from pydantic import BaseModel, ConfigDict


# ==========================================
# Slot Status
# ==========================================
class SlotStatus(str, Enum):
    AVAILABLE = "AVAILABLE"
    BOOKED = "BOOKED"
    CANCELLED = "CANCELLED"


# ==========================================
# Create Slot
# ==========================================
class SlotCreate(BaseModel):
    doctor_id: int
    slot_date: date
    slot_time: time
    duration_minutes: int = 30


# ==========================================
# Update Slot
# ==========================================
class SlotUpdate(BaseModel):
    slot_date: Optional[date] = None
    slot_time: Optional[time] = None
    duration_minutes: Optional[int] = None
    status: Optional[SlotStatus] = None


# ==========================================
# Slot Response
# ==========================================
class SlotResponse(BaseModel):
    id: int
    doctor_id: int
    slot_date: date
    slot_time: time
    duration_minutes: int
    status: SlotStatus

    model_config = ConfigDict(
        from_attributes=True
    )