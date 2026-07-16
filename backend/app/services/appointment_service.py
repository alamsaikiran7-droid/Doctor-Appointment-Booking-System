from datetime import datetime, timedelta, timezone

from sqlalchemy.orm import Session, joinedload

from app.models.appointment import Appointment
from app.models.doctor import Doctor
from app.models.slot import Slot
from app.models.user import User
from app.schemas.appointment_schema import (
    AppointmentCreate,
    AppointmentUpdate,
)
from app.utils.notification import (
    appointment_accepted_message,
    appointment_booked_message,
    appointment_cancelled_message,
    appointment_declined_message,
    appointment_reminder_message,
    send_sms,
)


# Reminder is sent when an accepted appointment
# is within the next 24 hours.
REMINDER_WINDOW_HOURS = 24


# =====================================
# Appointment Query With Relationships
# =====================================
def appointment_query(db: Session):
    return db.query(Appointment).options(
        joinedload(Appointment.patient),
        joinedload(Appointment.doctor),
        joinedload(Appointment.slot),
    )


# =====================================
# Automatically Complete Past Appointments
# =====================================
def update_completed_appointments(db: Session):
    accepted_appointments = (
        db.query(Appointment)
        .options(joinedload(Appointment.slot))
        .filter(Appointment.status == "ACCEPTED")
        .all()
    )

    current_datetime = datetime.now()
    appointments_updated = False

    for appointment in accepted_appointments:
        slot = appointment.slot

        if slot is None:
            continue

        if slot.slot_date is None:
            continue

        appointment_end_time = slot.end_time or slot.start_time

        if appointment_end_time is None:
            continue

        appointment_end_datetime = datetime.combine(
            slot.slot_date,
            appointment_end_time,
        )

        if current_datetime >= appointment_end_datetime:
            appointment.status = "COMPLETED"
            appointments_updated = True

    if appointments_updated:
        try:
            db.commit()
        except Exception:
            db.rollback()
            raise


# =====================================
# Send Upcoming Appointment Reminders
# =====================================
def send_appointment_reminders(db: Session):
    appointments = (
        db.query(Appointment)
        .options(
            joinedload(Appointment.patient),
            joinedload(Appointment.doctor),
            joinedload(Appointment.slot),
        )
        .filter(
            Appointment.status == "ACCEPTED",
            Appointment.reminder_sent.is_(False),
        )
        .all()
    )

    current_datetime = datetime.now()
    reminder_limit = current_datetime + timedelta(
        hours=REMINDER_WINDOW_HOURS
    )

    reminders_updated = False

    for appointment in appointments:
        patient = appointment.patient
        doctor = appointment.doctor
        slot = appointment.slot

        if patient is None or doctor is None or slot is None:
            continue

        if slot.slot_date is None or slot.start_time is None:
            continue

        appointment_start_datetime = datetime.combine(
            slot.slot_date,
            slot.start_time,
        )

        # Do not send reminders for appointments that already started.
        if appointment_start_datetime <= current_datetime:
            continue

        # Do not send reminders more than 24 hours in advance.
        if appointment_start_datetime > reminder_limit:
            continue

        if not patient.phone:
            continue

        message = appointment_reminder_message(
            patient_name=patient.full_name,
            doctor_name=doctor.name,
            slot_date=slot.slot_date,
            slot_time=slot.start_time,
        )

        reminder_sent = send_sms(
            patient.phone,
            message,
        )

        if reminder_sent:
            appointment.reminder_sent = True
            reminders_updated = True

    if reminders_updated:
        try:
            db.commit()
        except Exception:
            db.rollback()
            raise


# =====================================
# Process Appointment Statuses
# =====================================
def process_appointments(db: Session):
    update_completed_appointments(db)
    send_appointment_reminders(db)


# =====================================
# Book Appointment
# =====================================
def book_appointment(
    db: Session,
    appointment: AppointmentCreate,
):
    if appointment.patient_id is None:
        return "Patient ID is required"

    if appointment.doctor_id is None:
        return "Doctor ID is required"

    if appointment.slot_id is None:
        return "Slot ID is required"

    patient = (
        db.query(User)
        .filter(User.id == appointment.patient_id)
        .first()
    )

    if patient is None:
        return "Patient not found"

    doctor = (
        db.query(Doctor)
        .filter(Doctor.id == appointment.doctor_id)
        .first()
    )

    if doctor is None:
        return "Doctor not found"

    slot = (
        db.query(Slot)
        .filter(Slot.id == appointment.slot_id)
        .first()
    )

    if slot is None:
        return "Slot not found"

    if slot.doctor_id != appointment.doctor_id:
        return "Selected slot does not belong to this doctor"

    if slot.slot_date is None or slot.start_time is None:
        return "Slot date or time is missing"

    slot_start_datetime = datetime.combine(
        slot.slot_date,
        slot.start_time,
    )

    if slot_start_datetime <= datetime.now():
        return "Cannot book a past slot"

    if not slot.is_available:
        return "Slot already booked"

    existing_appointment = (
        db.query(Appointment)
        .filter(
            Appointment.slot_id == appointment.slot_id,
            Appointment.status.in_(
                [
                    "PENDING",
                    "CONFIRMED",
                    "ACCEPTED",
                ]
            ),
        )
        .first()
    )

    if existing_appointment is not None:
        return "Slot already booked"

    new_appointment = Appointment(
        patient_id=appointment.patient_id,
        doctor_id=appointment.doctor_id,
        slot_id=appointment.slot_id,
        status="PENDING",
        reminder_sent=False,
        created_at=datetime.now(timezone.utc),
    )

    db.add(new_appointment)

    slot.is_available = False

    try:
        db.commit()
        db.refresh(new_appointment)
    except Exception:
        db.rollback()
        raise

    saved_appointment = (
        appointment_query(db)
        .filter(Appointment.id == new_appointment.id)
        .first()
    )

    message = appointment_booked_message(
        patient_name=patient.full_name,
        doctor_name=doctor.name,
        slot_date=slot.slot_date,
        slot_time=slot.start_time,
    )

    if patient.phone:
        send_sms(
            patient.phone,
            message,
        )

    return saved_appointment


# =====================================
# Get All Appointments
# =====================================
def get_all_appointments(db: Session):
    process_appointments(db)

    return appointment_query(db).all()


# =====================================
# Get Appointment By ID
# =====================================
def get_appointment_by_id(
    db: Session,
    appointment_id: int,
):
    process_appointments(db)

    return (
        appointment_query(db)
        .filter(Appointment.id == appointment_id)
        .first()
    )


# =====================================
# Get Patient Appointments
# =====================================
def get_patient_appointments(
    db: Session,
    patient_id: int,
):
    process_appointments(db)

    return (
        appointment_query(db)
        .filter(Appointment.patient_id == patient_id)
        .all()
    )


# =====================================
# Get Doctor Appointments
# =====================================
def get_doctor_appointments(
    db: Session,
    doctor_id: int,
):
    process_appointments(db)

    return (
        appointment_query(db)
        .filter(Appointment.doctor_id == doctor_id)
        .all()
    )


# =====================================
# Update Appointment
# =====================================
def update_appointment(
    db: Session,
    appointment_id: int,
    appointment: AppointmentUpdate,
):
    existing_appointment = (
        db.query(Appointment)
        .filter(Appointment.id == appointment_id)
        .first()
    )

    if existing_appointment is None:
        return None

    update_data = appointment.model_dump(
        exclude_unset=True,
    )

    requested_status = update_data.get("status")

    if requested_status is not None:
        requested_status = (
            str(requested_status).strip().upper()
        )

        current_status = (
            str(existing_appointment.status)
            .strip()
            .upper()
            if existing_appointment.status
            else ""
        )

        allowed_transitions = {
            "PENDING": {
                "CONFIRMED",
                "CANCELLED",
            },
            "CONFIRMED": {
                "ACCEPTED",
                "DECLINED",
                "CANCELLED",
            },
            "ACCEPTED": {
                "COMPLETED",
                "CANCELLED",
            },
            "DECLINED": set(),
            "CANCELLED": set(),
            "COMPLETED": set(),
        }

        allowed_next_statuses = allowed_transitions.get(
            current_status,
            set(),
        )

        if requested_status not in allowed_next_statuses:
            return (
                f"Appointment status cannot change from "
                f"{current_status or 'UNKNOWN'} to "
                f"{requested_status}"
            )

        existing_appointment.status = requested_status

    try:
        db.commit()
        db.refresh(existing_appointment)
    except Exception:
        db.rollback()
        raise

    return (
        appointment_query(db)
        .filter(Appointment.id == appointment_id)
        .first()
    )

# =====================================
# Accept Appointment
# =====================================
def accept_appointment(
    db: Session,
    appointment_id: int,
):
    appointment = (
        db.query(Appointment)
        .options(
            joinedload(Appointment.patient),
            joinedload(Appointment.doctor),
            joinedload(Appointment.slot),
        )
        .filter(Appointment.id == appointment_id)
        .first()
    )

    if appointment is None:
        return None

    current_status = (
        str(appointment.status).strip().upper()
        if appointment.status
        else ""
    )

    if current_status != "CONFIRMED":
        return "Only confirmed appointments can be accepted"

    slot = appointment.slot

    if slot is None:
        return "Appointment slot not found"

    appointment_end_time = (
        slot.end_time or slot.start_time
    )

    if (
        slot.slot_date is not None
        and appointment_end_time is not None
    ):
        appointment_end_datetime = datetime.combine(
            slot.slot_date,
            appointment_end_time,
        )

        if datetime.now() >= appointment_end_datetime:
            appointment.status = "COMPLETED"
        else:
            appointment.status = "ACCEPTED"
    else:
        appointment.status = "ACCEPTED"

    appointment.reminder_sent = False

    try:
        db.commit()
        db.refresh(appointment)
    except Exception:
        db.rollback()
        raise

    if (
        appointment.status == "ACCEPTED"
        and appointment.patient is not None
        and appointment.doctor is not None
        and appointment.slot is not None
        and appointment.patient.phone
    ):
        message = appointment_accepted_message(
            patient_name=appointment.patient.full_name,
            doctor_name=appointment.doctor.name,
            slot_date=appointment.slot.slot_date,
            slot_time=appointment.slot.start_time,
        )

        send_sms(
            appointment.patient.phone,
            message,
        )

    send_appointment_reminders(db)

    return (
        appointment_query(db)
        .filter(Appointment.id == appointment_id)
        .first()
    )
# =====================================
# Decline Appointment
# =====================================
def decline_appointment(
    db: Session,
    appointment_id: int,
    reason: str = "",
):
    appointment = (
        db.query(Appointment)
        .options(
            joinedload(Appointment.patient),
            joinedload(Appointment.doctor),
        )
        .filter(Appointment.id == appointment_id)
        .first()
    )

    if appointment is None:
        return None

    current_status = (
        str(appointment.status).strip().upper()
        if appointment.status
        else ""
    )

    if current_status != "CONFIRMED":
        return "Only confirmed appointments can be declined"

    appointment.status = "DECLINED"
    appointment.reason = reason
    appointment.reminder_sent = False

    slot = (
        db.query(Slot)
        .filter(Slot.id == appointment.slot_id)
        .first()
    )

    if slot is not None:
        slot.is_available = True

    try:
        db.commit()
        db.refresh(appointment)
    except Exception:
        db.rollback()
        raise

    if (
        appointment.patient is not None
        and appointment.doctor is not None
        and appointment.patient.phone
    ):
        message = appointment_declined_message(
            patient_name=appointment.patient.full_name,
            doctor_name=appointment.doctor.name,
            reason=reason,
        )

        send_sms(
            appointment.patient.phone,
            message,
        )

    return (
        appointment_query(db)
        .filter(Appointment.id == appointment_id)
        .first()
    )

# =====================================
# Cancel Appointment
# =====================================
def cancel_appointment(
    db: Session,
    appointment_id: int,
):
    appointment = (
        db.query(Appointment)
        .filter(Appointment.id == appointment_id)
        .first()
    )

    if appointment is None:
        return None

    current_status = (
        str(appointment.status).strip().upper()
        if appointment.status
        else ""
    )

    allowed_statuses = {
        "PENDING",
        "CONFIRMED",
        "ACCEPTED",
    }

    if current_status not in allowed_statuses:
        return (
            f"Appointment cannot be cancelled while its "
            f"status is {current_status or 'UNKNOWN'}"
        )

    appointment.status = "CANCELLED"
    appointment.reminder_sent = False

    slot = (
        db.query(Slot)
        .filter(Slot.id == appointment.slot_id)
        .first()
    )

    if slot is not None:
        slot.is_available = True

    try:
        db.commit()
        db.refresh(appointment)
    except Exception:
        db.rollback()
        raise

    patient = (
        db.query(User)
        .filter(User.id == appointment.patient_id)
        .first()
    )

    doctor = (
        db.query(Doctor)
        .filter(Doctor.id == appointment.doctor_id)
        .first()
    )

    message = appointment_cancelled_message(
        patient_name=(
            patient.full_name
            if patient is not None
            else "Patient"
        ),
        doctor_name=(
            doctor.name
            if doctor is not None
            else "Doctor"
        ),
    )

    if patient is not None and patient.phone:
        send_sms(
            patient.phone,
            message,
        )

    return (
        appointment_query(db)
        .filter(Appointment.id == appointment_id)
        .first()
    )


# =====================================
# Delete Appointment
# =====================================
def delete_appointment(
    db: Session,
    appointment_id: int,
):
    appointment = (
        db.query(Appointment)
        .filter(Appointment.id == appointment_id)
        .first()
    )

    if appointment is None:
        return None

    slot = (
        db.query(Slot)
        .filter(Slot.id == appointment.slot_id)
        .first()
    )

    if slot is not None:
        slot.is_available = True

    try:
        db.delete(appointment)
        db.commit()
    except Exception:
        db.rollback()
        raise

    return True