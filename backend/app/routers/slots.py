from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.slot_schema import (
    SlotCreate,
    SlotUpdate,
    SlotResponse,
)
from app.services import slot_service

router = APIRouter(
    prefix="/slots",
    tags=["Slots"],
)


# =====================================
# Create Slot
# =====================================
@router.post(
    "/",
    response_model=SlotResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_slot(
    slot: SlotCreate,
    db: Session = Depends(get_db),
):
    result = slot_service.create_slot(db, slot)

    if result is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor not found",
        )

    if result == "Slot already exists":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Slot already exists",
        )

    return result


# =====================================
# Get All Slots
# =====================================
@router.get(
    "/",
    response_model=List[SlotResponse],
)
def get_all_slots(
    db: Session = Depends(get_db),
):
    return slot_service.get_all_slots(db)


# =====================================
# Get Slot By ID
# =====================================
@router.get(
    "/{slot_id}",
    response_model=SlotResponse,
)
def get_slot_by_id(
    slot_id: int,
    db: Session = Depends(get_db),
):
    slot = slot_service.get_slot_by_id(db, slot_id)

    if slot is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Slot not found",
        )

    return slot


# =====================================
# Get Slots By Doctor
# =====================================
@router.get(
    "/doctor/{doctor_id}",
    response_model=List[SlotResponse],
)
def get_slots_by_doctor(
    doctor_id: int,
    db: Session = Depends(get_db),
):
    return slot_service.get_slots_by_doctor(
        db,
        doctor_id,
    )


# =====================================
# Get Available Slots
# =====================================
@router.get(
    "/available/{doctor_id}",
    response_model=List[SlotResponse],
)
def get_available_slots(
    doctor_id: int,
    db: Session = Depends(get_db),
):
    return slot_service.get_available_slots(
        db,
        doctor_id,
    )


# =====================================
# Update Slot
# =====================================
@router.put(
    "/{slot_id}",
    response_model=SlotResponse,
)
def update_slot(
    slot_id: int,
    slot: SlotUpdate,
    db: Session = Depends(get_db),
):
    updated_slot = slot_service.update_slot(
        db,
        slot_id,
        slot,
    )

    if updated_slot is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Slot not found",
        )

    return updated_slot


# =====================================
# Delete Slot
# =====================================
@router.delete("/{slot_id}")
def delete_slot(
    slot_id: int,
    db: Session = Depends(get_db),
):
    deleted_slot = slot_service.delete_slot(
        db,
        slot_id,
    )

    if deleted_slot is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Slot not found",
        )

    return {
        "message": "Slot deleted successfully"
    }