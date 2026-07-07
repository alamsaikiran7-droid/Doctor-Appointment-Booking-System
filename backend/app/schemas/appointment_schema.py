from datetime import date, time, datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


# =====================================
# Create Appointment Schema
# =====================================
class AppointmentCreate(BaseModel):
    patient_id: int
    doctor_id: int
    slot_id: int


# =====================================
# Update Appointment Schema
# =====================================
class AppointmentUpdate(BaseModel):
    status: Optional[str] = None


# =====================================
# Appointment Response Schema
# =====================================
class AppointmentResponse(BaseModel):
    id: int
    patient_id: int
    doctor_id: int
    slot_id: int
    appointment_date: date
    appointment_time: time
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)