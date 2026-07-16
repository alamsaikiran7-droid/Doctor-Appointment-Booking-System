from typing import Any, Dict, List

from fastapi import APIRouter, Body, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.appointment_schema import (
    AppointmentCreate,
    AppointmentResponse,
    AppointmentUpdate,
)
from app.services import appointment_service


router = APIRouter(
    prefix="/appointments",
    tags=["Appointments"],
)


# =====================================
# Format Appointment Response
# =====================================
def format_appointment_response(
    appointment: Any,
) -> Dict[str, Any]:
    """
    Convert an Appointment SQLAlchemy object into the response
    structure expected by AppointmentResponse and the React frontend.
    """

    patient = getattr(appointment, "patient", None)
    doctor = getattr(appointment, "doctor", None)
    slot = getattr(appointment, "slot", None)

    patient_name = None
    doctor_name = None
    specialization = None
    appointment_date = None
    appointment_time = None

    if patient is not None:
        patient_name = (
            getattr(patient, "full_name", None)
            or getattr(patient, "name", None)
            or getattr(patient, "username", None)
        )

    if doctor is not None:
        doctor_name = getattr(doctor, "name", None)

        specialization = (
            getattr(doctor, "specialization", None)
            or getattr(doctor, "speciality", None)
        )

    if slot is not None:
        appointment_date = getattr(
            slot,
            "slot_date",
            None,
        )

        appointment_time = getattr(
            slot,
            "start_time",
            None,
        )

    notes = (
        getattr(appointment, "notes", None)
        or getattr(appointment, "reason", None)
    )

    return {
        "id": appointment.id,
        "patient_id": appointment.patient_id,
        "doctor_id": appointment.doctor_id,
        "slot_id": appointment.slot_id,
        "date": appointment_date,
        "time": appointment_time,
        "status": appointment.status,
        "notes": notes,
        "patient_name": patient_name,
        "doctor_name": doctor_name,
        "specialization": specialization,
        "created_at": appointment.created_at,
    }


# =====================================
# Book Appointment
# =====================================
@router.post(
    "/",
    response_model=AppointmentResponse,
    status_code=status.HTTP_201_CREATED,
)
def book_appointment(
    appointment: AppointmentCreate,
    db: Session = Depends(get_db),
):
    result = appointment_service.book_appointment(
        db=db,
        appointment=appointment,
    )

    if result is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient, doctor, or slot not found",
        )

    if isinstance(result, str):
        if result in {
            "Patient not found",
            "Doctor not found",
            "Slot not found",
        }:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=result,
            )

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result,
        )

    return format_appointment_response(result)


# =====================================
# Get All Appointments
# =====================================
@router.get(
    "/",
    response_model=List[AppointmentResponse],
)
def get_all_appointments(
    db: Session = Depends(get_db),
):
    appointments = (
        appointment_service.get_all_appointments(db)
    )

    return [
        format_appointment_response(appointment)
        for appointment in appointments
    ]


# =====================================
# Get Patient Appointments
# =====================================
@router.get(
    "/patient/{patient_id}",
    response_model=List[AppointmentResponse],
)
def get_patient_appointments(
    patient_id: int,
    db: Session = Depends(get_db),
):
    appointments = (
        appointment_service.get_patient_appointments(
            db=db,
            patient_id=patient_id,
        )
    )

    return [
        format_appointment_response(appointment)
        for appointment in appointments
    ]


# =====================================
# Get Doctor Appointments
# =====================================
@router.get(
    "/doctor/{doctor_id}",
    response_model=List[AppointmentResponse],
)
def get_doctor_appointments(
    doctor_id: int,
    db: Session = Depends(get_db),
):
    appointments = (
        appointment_service.get_doctor_appointments(
            db=db,
            doctor_id=doctor_id,
        )
    )

    return [
        format_appointment_response(appointment)
        for appointment in appointments
    ]


# =====================================
# Accept Appointment
# =====================================
@router.put(
    "/{appointment_id}/accept",
    response_model=AppointmentResponse,
)
def accept_appointment(
    appointment_id: int,
    db: Session = Depends(get_db),
):
    appointment = (
        appointment_service.accept_appointment(
            db=db,
            appointment_id=appointment_id,
        )
    )

    if appointment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found",
        )

    if isinstance(appointment, str):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=appointment,
        )

    return format_appointment_response(appointment)


# =====================================
# Decline Appointment
# =====================================
@router.put(
    "/{appointment_id}/decline",
    response_model=AppointmentResponse,
)
def decline_appointment(
    appointment_id: int,
    payload: Dict[str, str] = Body(
        default_factory=dict
    ),
    db: Session = Depends(get_db),
):
    reason = payload.get("reason", "")

    appointment = (
        appointment_service.decline_appointment(
            db=db,
            appointment_id=appointment_id,
            reason=reason,
        )
    )

    if appointment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found",
        )

    return format_appointment_response(appointment)


# =====================================
# Cancel Appointment
# =====================================
@router.patch(
    "/{appointment_id}/cancel",
    response_model=AppointmentResponse,
)
def cancel_appointment(
    appointment_id: int,
    db: Session = Depends(get_db),
):
    appointment = (
        appointment_service.cancel_appointment(
            db=db,
            appointment_id=appointment_id,
        )
    )

    if appointment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found",
        )

    return format_appointment_response(appointment)


# =====================================
# Update Appointment
# =====================================
@router.put(
    "/{appointment_id}",
    response_model=AppointmentResponse,
)
def update_appointment(
    appointment_id: int,
    appointment: AppointmentUpdate,
    db: Session = Depends(get_db),
):
    updated_appointment = (
        appointment_service.update_appointment(
            db=db,
            appointment_id=appointment_id,
            appointment=appointment,
        )
    )

    if updated_appointment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found",
        )

    return format_appointment_response(
        updated_appointment
    )


# =====================================
# Get Appointment By ID
# =====================================
@router.get(
    "/{appointment_id}",
    response_model=AppointmentResponse,
)
def get_appointment_by_id(
    appointment_id: int,
    db: Session = Depends(get_db),
):
    appointment = (
        appointment_service.get_appointment_by_id(
            db=db,
            appointment_id=appointment_id,
        )
    )

    if appointment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found",
        )

    return format_appointment_response(appointment)


# =====================================
# Delete Appointment
# =====================================
@router.delete(
    "/{appointment_id}",
    status_code=status.HTTP_200_OK,
)
def delete_appointment(
    appointment_id: int,
    db: Session = Depends(get_db),
):
    result = appointment_service.delete_appointment(
        db=db,
        appointment_id=appointment_id,
    )

    if result is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found",
        )

    if isinstance(result, str):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=result,
        )

    return {
        "message": "Appointment deleted successfully",
    }