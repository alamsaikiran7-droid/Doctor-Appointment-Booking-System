from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.payment_schema import (
    PaymentCreate,
    PaymentProcess,
    PaymentResponse,
)
from app.services.payment_service import (
    create_payment,
    get_all_payments,
    get_payment_by_appointment,
    get_payment_by_id,
    get_payments_by_patient,
    process_payment,
)


router = APIRouter(
    prefix="/payments",
    tags=["Payments"],
)


# =====================================
# Create Demo Payment
# =====================================
@router.post(
    "/",
    response_model=PaymentResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_demo_payment(
    payment_data: PaymentCreate,
    db: Session = Depends(get_db),
):
    try:
        return create_payment(
            db=db,
            payment_data=payment_data,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc


# =====================================
# Process Demo Payment
# =====================================
@router.put(
    "/{payment_id}/process",
    response_model=PaymentResponse,
)
def process_demo_payment(
    payment_id: int,
    payment_data: PaymentProcess,
    db: Session = Depends(get_db),
):
    try:
        return process_payment(
            db=db,
            payment_id=payment_id,
            payment_successful=payment_data.payment_successful,
            failure_reason=payment_data.failure_reason,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc


# =====================================
# Get All Payments
# =====================================
@router.get(
    "/",
    response_model=List[PaymentResponse],
)
def read_all_payments(
    db: Session = Depends(get_db),
):
    return get_all_payments(db=db)


# =====================================
# Get Payments by Patient
# =====================================
@router.get(
    "/patient/{patient_id}",
    response_model=List[PaymentResponse],
)
def read_payments_by_patient(
    patient_id: int,
    db: Session = Depends(get_db),
):
    return get_payments_by_patient(
        db=db,
        patient_id=patient_id,
    )


# =====================================
# Get Payment by Appointment
# =====================================
@router.get(
    "/appointment/{appointment_id}",
    response_model=PaymentResponse,
)
def read_payment_by_appointment(
    appointment_id: int,
    db: Session = Depends(get_db),
):
    payment = get_payment_by_appointment(
        db=db,
        appointment_id=appointment_id,
    )

    if payment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment not found for this appointment",
        )

    return payment


# =====================================
# Get Payment by ID
# =====================================
@router.get(
    "/{payment_id}",
    response_model=PaymentResponse,
)
def read_payment_by_id(
    payment_id: int,
    db: Session = Depends(get_db),
):
    payment = get_payment_by_id(
        db=db,
        payment_id=payment_id,
    )

    if payment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment not found",
        )

    return payment