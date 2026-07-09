from datetime import datetime, timedelta

from sqlalchemy.orm import Session

from app.models.doctor import Doctor
from app.models.slot import Slot
from app.schemas.slot_schema import SlotCreate, SlotUpdate


def create_slot(db: Session, slot: SlotCreate):
    doctor = db.query(Doctor).filter(Doctor.id == slot.doctor_id).first()

    if doctor is None:
        return None

    existing_slot = db.query(Slot).filter(
        Slot.doctor_id == slot.doctor_id,
        Slot.slot_date == slot.slot_date,
        Slot.start_time == slot.slot_time,
    ).first()

    if existing_slot is not None:
        return "Slot already exists"

    start_time = slot.slot_time
    end_time = (
        datetime.combine(datetime.today().date(), start_time) + timedelta(minutes=slot.duration_minutes or 30)
    ).time()

    new_slot = Slot(
        doctor_id=slot.doctor_id,
        slot_date=slot.slot_date,
        start_time=start_time,
        end_time=end_time,
        is_available=True,
    )

    db.add(new_slot)
    db.commit()
    db.refresh(new_slot)

    return new_slot


def get_all_slots(db: Session):
    return db.query(Slot).all()


def get_slot_by_id(db: Session, slot_id: int):
    return db.query(Slot).filter(Slot.id == slot_id).first()


def get_slots_by_doctor(db: Session, doctor_id: int):
    return db.query(Slot).filter(Slot.doctor_id == doctor_id).all()


def get_available_slots(db: Session, doctor_id: int):
    return db.query(Slot).filter(
        Slot.doctor_id == doctor_id,
        Slot.is_available.is_(True),
    ).all()


def update_slot(db: Session, slot_id: int, slot_data: SlotUpdate):
    slot = db.query(Slot).filter(Slot.id == slot_id).first()

    if slot is None:
        return None

    update_data = slot_data.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        if key == "status":
            setattr(slot, "is_available", value == "AVAILABLE")
        else:
            setattr(slot, key, value)

    db.commit()
    db.refresh(slot)

    return slot


def delete_slot(db: Session, slot_id: int):
    slot = db.query(Slot).filter(Slot.id == slot_id).first()

    if slot is None:
        return None

    db.delete(slot)
    db.commit()

    return slot