from datetime import datetime, timedelta

from sqlalchemy import exists
from sqlalchemy.orm import Session

from app.models.appointment import Appointment
from app.models.doctor import Doctor
from app.models.slot import Slot
from app.schemas.slot_schema import (
    SlotCreate,
    SlotUpdate,
)


# ==========================================
# Synchronize Booked Slot Availability
# ==========================================
def synchronize_booked_slots(
    db: Session,
    doctor_id: int | None = None,
) -> None:
    query = db.query(Slot)

    if doctor_id is not None:
        query = query.filter(
            Slot.doctor_id == doctor_id
        )

    slots = query.all()
    changes_made = False

    for slot in slots:
        appointment_exists = (
            db.query(Appointment.id)
            .filter(
                Appointment.slot_id == slot.id
            )
            .first()
            is not None
        )

        if appointment_exists and slot.is_available:
            slot.is_available = False
            changes_made = True

    if changes_made:
        db.commit()


# ==========================================
# Create Slot
# ==========================================
def create_slot(
    db: Session,
    slot: SlotCreate,
):
    doctor = (
        db.query(Doctor)
        .filter(
            Doctor.id == slot.doctor_id
        )
        .first()
    )

    if doctor is None:
        return None

    existing_slot = (
        db.query(Slot)
        .filter(
            Slot.doctor_id == slot.doctor_id,
            Slot.slot_date == slot.slot_date,
            Slot.start_time == slot.slot_time,
        )
        .first()
    )

    if existing_slot is not None:
        return "Slot already exists"

    start_datetime = datetime.combine(
        slot.slot_date,
        slot.slot_time,
    )

    end_datetime = (
        start_datetime
        + timedelta(
            minutes=slot.duration_minutes
        )
    )

    new_slot = Slot(
        doctor_id=slot.doctor_id,
        slot_date=slot.slot_date,
        start_time=slot.slot_time,
        end_time=end_datetime.time(),
        is_available=True,
    )

    db.add(new_slot)
    db.commit()
    db.refresh(new_slot)

    return new_slot


# ==========================================
# Get All Slots
# ==========================================
def get_all_slots(
    db: Session,
):
    synchronize_booked_slots(db)

    return (
        db.query(Slot)
        .order_by(
            Slot.slot_date.asc(),
            Slot.start_time.asc(),
        )
        .all()
    )


# ==========================================
# Get Slot By ID
# ==========================================
def get_slot_by_id(
    db: Session,
    slot_id: int,
):
    slot = (
        db.query(Slot)
        .filter(
            Slot.id == slot_id
        )
        .first()
    )

    if slot is None:
        return None

    appointment_exists = (
        db.query(Appointment.id)
        .filter(
            Appointment.slot_id == slot.id
        )
        .first()
        is not None
    )

    if appointment_exists and slot.is_available:
        slot.is_available = False
        db.commit()
        db.refresh(slot)

    return slot


# ==========================================
# Get Slots By Doctor
# ==========================================
def get_slots_by_doctor(
    db: Session,
    doctor_id: int,
):
    synchronize_booked_slots(
        db=db,
        doctor_id=doctor_id,
    )

    return (
        db.query(Slot)
        .filter(
            Slot.doctor_id == doctor_id
        )
        .order_by(
            Slot.slot_date.asc(),
            Slot.start_time.asc(),
        )
        .all()
    )


# ==========================================
# Get Available Slots
# ==========================================
def get_available_slots(
    db: Session,
    doctor_id: int,
):
    synchronize_booked_slots(
        db=db,
        doctor_id=doctor_id,
    )

    current_datetime = datetime.now()
    current_date = current_datetime.date()
    current_time = current_datetime.time()

    appointment_exists = (
        exists()
        .where(
            Appointment.slot_id == Slot.id
        )
    )

    return (
        db.query(Slot)
        .filter(
            Slot.doctor_id == doctor_id,
            Slot.is_available.is_(True),
            ~appointment_exists,
            (
                (Slot.slot_date > current_date)
                |
                (
                    (Slot.slot_date == current_date)
                    & (Slot.start_time > current_time)
                )
            ),
        )
        .order_by(
            Slot.slot_date.asc(),
            Slot.start_time.asc(),
        )
        .all()
    )

# ==========================================
# Update Slot
# ==========================================
def update_slot(
    db: Session,
    slot_id: int,
    slot_data: SlotUpdate,
):
    slot = (
        db.query(Slot)
        .filter(
            Slot.id == slot_id
        )
        .first()
    )

    if slot is None:
        return None

    appointment_exists = (
        db.query(Appointment.id)
        .filter(
            Appointment.slot_id == slot.id
        )
        .first()
        is not None
    )

    if slot_data.slot_date is not None:
        slot.slot_date = slot_data.slot_date

    if slot_data.slot_time is not None:
        slot.start_time = slot_data.slot_time

        current_duration = int(
            (
                datetime.combine(
                    slot.slot_date,
                    slot.end_time,
                )
                - datetime.combine(
                    slot.slot_date,
                    slot.start_time,
                )
            ).total_seconds()
            / 60
        )

        duration = (
            slot_data.duration_minutes
            if slot_data.duration_minutes is not None
            else current_duration
        )

        end_datetime = (
            datetime.combine(
                slot.slot_date,
                slot.start_time,
            )
            + timedelta(minutes=duration)
        )

        slot.end_time = end_datetime.time()

    elif slot_data.duration_minutes is not None:
        end_datetime = (
            datetime.combine(
                slot.slot_date,
                slot.start_time,
            )
            + timedelta(
                minutes=slot_data.duration_minutes
            )
        )

        slot.end_time = end_datetime.time()

    if slot_data.status is not None:
        requested_available = (
            slot_data.status == "AVAILABLE"
        )

        if requested_available and appointment_exists:
            return (
                "This slot already has an appointment "
                "and cannot be marked available"
            )

        slot.is_available = requested_available

    if appointment_exists:
        slot.is_available = False

    db.commit()
    db.refresh(slot)

    return slot


# ==========================================
# Delete Slot
# ==========================================
def delete_slot(
    db: Session,
    slot_id: int,
):
    slot = (
        db.query(Slot)
        .filter(
            Slot.id == slot_id
        )
        .first()
    )

    if slot is None:
        return None

    appointment_exists = (
        db.query(Appointment.id)
        .filter(
            Appointment.slot_id == slot.id
        )
        .first()
        is not None
    )

    if appointment_exists:
        return (
            "This slot has an appointment "
            "and cannot be deleted"
        )

    db.delete(slot)
    db.commit()

    return slot