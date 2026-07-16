import datetime as dt
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


# =====================================
# Create Appointment Schema
# =====================================
class AppointmentCreate(BaseModel):
    patient_id: Optional[int] = Field(default=None, alias="patientId")
    doctor_id: Optional[int] = Field(default=None, alias="doctorId")
    slot_id: Optional[int] = Field(default=None, alias="slotId")

    appointment_date: Optional[dt.date] = Field(default=None, alias="date")
    appointment_time: Optional[dt.time] = Field(default=None, alias="time")

    model_config = ConfigDict(
        populate_by_name=True,
        extra="allow",
    )


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

    date: Optional[dt.date] = None
    time: Optional[dt.time] = None

    status: str
    notes: Optional[str] = None

    patient_name: Optional[str] = None
    patient_phone: Optional[str] = None
    patient_email: Optional[str] = None

    doctor_name: Optional[str] = None
    specialization: Optional[str] = None

    created_at: dt.datetime

    model_config = ConfigDict(from_attributes=True)