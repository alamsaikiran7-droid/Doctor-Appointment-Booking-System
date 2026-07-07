from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Date, Time
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base


class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)

    patient_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    doctor_id = Column(Integer, ForeignKey("doctors.id"), nullable=False)
    slot_id = Column(Integer, ForeignKey("slots.id"), unique=True, nullable=False)

    reason = Column(String(255), nullable=True)
    appointment_date = Column(Date, nullable=False)
    appointment_time = Column(Time, nullable=False)

    status = Column(String(20), default="booked", nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    patient = relationship("User", back_populates="appointments")
    doctor = relationship("Doctor", back_populates="appointments")
    slot = relationship("Slot", back_populates="appointment")
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.appointment_schema import (
    AppointmentCreate,
    AppointmentUpdate,
    AppointmentResponse,
)
from app.services import appointment_service

router = APIRouter(
    prefix="/appointments",
    tags=["Appointments"]
)


# =====================================
# Book Appointment
# =====================================
@router.post(
    "/",
    response_model=AppointmentResponse,
    status_code=status.HTTP_201_CREATED
)
def book_appointment(
    appointment: AppointmentCreate,
    db: Session = Depends(get_db)
):

    result = appointment_service.book_appointment(
        db,
        appointment
    )

    if result is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor or Slot not found"
        )

    if result == "Slot already booked":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Slot already booked"
        )

    return result


# =====================================
# Get All Appointments
# =====================================
@router.get(
    "/",
    response_model=List[AppointmentResponse]
)
def get_all_appointments(
    db: Session = Depends(get_db)
):

    return appointment_service.get_all_appointments(db)


# =====================================
# Get Appointment By ID
# =====================================
@router.get(
    "/{appointment_id}",
    response_model=AppointmentResponse
)
def get_appointment_by_id(
    appointment_id: int,
    db: Session = Depends(get_db)
):

    appointment = appointment_service.get_appointment_by_id(
        db,
        appointment_id
    )

    if appointment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found"
        )

    return appointment


# =====================================
# Get Patient Appointments
# =====================================
@router.get(
    "/patient/{patient_id}",
    response_model=List[AppointmentResponse]
)
def get_patient_appointments(
    patient_id: int,
    db: Session = Depends(get_db)
):

    return appointment_service.get_patient_appointments(
        db,
        patient_id
    )


# =====================================
# Get Doctor Appointments
# =====================================
@router.get(
    "/doctor/{doctor_id}",
    response_model=List[AppointmentResponse]
)
def get_doctor_appointments(
    doctor_id: int,
    db: Session = Depends(get_db)
):

    return appointment_service.get_doctor_appointments(
        db,
        doctor_id
    )


# =====================================
# Update Appointment
# =====================================
@router.put(
    "/{appointment_id}",
    response_model=AppointmentResponse
)
def update_appointment(
    appointment_id: int,
    appointment: AppointmentUpdate,
    db: Session = Depends(get_db)
):

    updated = appointment_service.update_appointment(
        db,
        appointment_id,
        appointment
    )

    if updated is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found"
        )

    return updated


# =====================================
# Cancel Appointment
# =====================================
@router.patch(
    "/{appointment_id}/cancel",
    response_model=AppointmentResponse
)
def cancel_appointment(
    appointment_id: int,
    db: Session = Depends(get_db)
):

    appointment = appointment_service.cancel_appointment(
        db,
        appointment_id
    )

    if appointment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found"
        )

    return appointment


# =====================================
# Delete Appointment
# =====================================
@router.delete(
    "/{appointment_id}"
)
def delete_appointment(
    appointment_id: int,
    db: Session = Depends(get_db)
):

    appointment = appointment_service.delete_appointment(
        db,
        appointment_id
    )

    if appointment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found"
        )

    return {
        "message": "Appointment deleted successfully"
    }
