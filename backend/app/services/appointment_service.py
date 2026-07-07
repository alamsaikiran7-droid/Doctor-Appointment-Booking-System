from datetime import datetime

from sqlalchemy.orm import Session

from app.models.appointment import Appointment
from app.models.doctor import Doctor
from app.models.slot import Slot
from app.models.user import User
from app.schemas.appointment_schema import (
    AppointmentCreate,
    AppointmentUpdate,
)


# =====================================
# Book Appointment
# =====================================
def book_appointment(
    db: Session,
    appointment: AppointmentCreate
):

    # Check Patient
    patient = db.query(User).filter(
        User.id == appointment.patient_id
    ).first()

    if patient is None:
        return None

    # Check Doctor
    doctor = db.query(Doctor).filter(
        Doctor.id == appointment.doctor_id
    ).first()

    if doctor is None:
        return None

    # Check Slot
    slot = db.query(Slot).filter(
        Slot.id == appointment.slot_id
    ).first()

    if slot is None:
        return None

    # Check Slot Availability
    if slot.is_available is False:
        return "Slot already booked"

    # Create Appointment
    new_appointment = Appointment(
        patient_id=appointment.patient_id,
        doctor_id=appointment.doctor_id,
        slot_id=appointment.slot_id,
        appointment_date=slot.slot_date,
        appointment_time=slot.start_time,
        status="BOOKED",
        created_at=datetime.utcnow()
    )

    db.add(new_appointment)

    # Update Slot Status
    slot.is_available = False

    db.commit()
    db.refresh(new_appointment)

    return new_appointment


# =====================================
# Get All Appointments
# =====================================
def get_all_appointments(db: Session):

    return db.query(Appointment).all()


# =====================================
# Get Appointment By ID
# =====================================
def get_appointment_by_id(
    db: Session,
    appointment_id: int
):

    return db.query(Appointment).filter(
        Appointment.id == appointment_id
    ).first()


# =====================================
# Get Patient Appointments
# =====================================
def get_patient_appointments(
    db: Session,
    patient_id: int
):

    return db.query(Appointment).filter(
        Appointment.patient_id == patient_id
    ).all()


# =====================================
# Get Doctor Appointments
# =====================================
def get_doctor_appointments(
    db: Session,
    doctor_id: int
):

    return db.query(Appointment).filter(
        Appointment.doctor_id == doctor_id
    ).all()


# =====================================
# Update Appointment
# =====================================
def update_appointment(
    db: Session,
    appointment_id: int,
    appointment: AppointmentUpdate
):

    existing_appointment = db.query(Appointment).filter(
        Appointment.id == appointment_id
    ).first()

    if existing_appointment is None:
        return None

    update_data = appointment.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(existing_appointment, key, value)

    db.commit()
    db.refresh(existing_appointment)

    return existing_appointment


# =====================================
# Cancel Appointment
# =====================================
def cancel_appointment(
    db: Session,
    appointment_id: int
):

    appointment = db.query(Appointment).filter(
        Appointment.id == appointment_id
    ).first()

    if appointment is None:
        return None

    appointment.status = "CANCELLED"

    slot = db.query(Slot).filter(
        Slot.id == appointment.slot_id
    ).first()

    if slot:
        slot.is_available = True

    db.commit()
    db.refresh(appointment)

    return appointment


# =====================================
# Delete Appointment
# =====================================
def delete_appointment(
    db: Session,
    appointment_id: int
):

    appointment = db.query(Appointment).filter(
        Appointment.id == appointment_id
    ).first()

    if appointment is None:
        return None

    slot = db.query(Slot).filter(
        Slot.id == appointment.slot_id
    ).first()

    if slot:
        slot.is_available = True

    db.delete(appointment)
    db.commit()

    return appointment