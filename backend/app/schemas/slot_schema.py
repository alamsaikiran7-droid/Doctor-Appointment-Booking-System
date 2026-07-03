
from pydantic import BaseModel
from typing import Optional
from datetime import date, time
from enum import Enum


class SlotStatus(str, Enum):
    AVAILABLE = "AVAILABLE"
    BOOKED = "BOOKED"
    CANCELLED = "CANCELLED"


class SlotCreate(BaseModel):
    doctor_id: int
    slot_date: date
    slot_time: time
    duration_minutes: Optional[int] = 30


class SlotUpdate(BaseModel):
    slot_date: Optional[date] = None
    slot_time: Optional[time] = None
    duration_minutes: Optional[int] = None
    status: Optional[SlotStatus] = None


class SlotResponse(BaseModel):
    id: int
    doctor_id: int
    slot_date: date
    slot_time: time
    duration_minutes: int
    status: SlotStatus

    class Config:
        from_attributes = True