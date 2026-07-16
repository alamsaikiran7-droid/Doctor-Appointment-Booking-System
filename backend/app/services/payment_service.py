from datetime import datetime, timezone
from typing import Optional
from uuid import uuid4

from sqlalchemy.orm import Session

from app.models.appointment import Appointment
from app.models.payment import Payment
from app.models.user import User
from app.schemas.payment_schema import PaymentCreate


# =====================================
# Generate Demo Transaction ID
# =====================================
def generate_transaction_id() -> str:
    return f"DEMO-{uuid4().hex.upper()}"


# =====================================
# Create Payment
# =====================================
def create_payment(
    db: Session,
    payment_data: PaymentCreate,
) -> Payment:
    appointment = (
        db.query(Appointment)
        .filter(
            Appointment.id == payment_data.appointment_id,
        )
        .first()
    )

    if appointment is None:
        raise ValueError("Appointment not found")

    patient = (
        db.query(User)
        .filter(
            User.id == payment_data.patient_id,
        )
        .first()
    )

    if patient is None:
        raise ValueError("Patient not found")

    if appointment.patient_id != payment_data.patient_id:
        raise ValueError(
            "This appointment does not belong to the selected patient"
        )

    existing_payment = (
        db.query(Payment)
        .filter(
            Payment.appointment_id
            == payment_data.appointment_id,
        )
        .first()
    )

    if existing_payment is not None:
        raise ValueError(
            "A payment already exists for this appointment"
        )

    payment = Payment(
        appointment_id=payment_data.appointment_id,
        patient_id=payment_data.patient_id,
        amount=payment_data.amount,
        currency="INR",
        payment_method=payment_data.payment_method.upper(),
        payment_status="PENDING",
        transaction_id=generate_transaction_id(),
    )

    db.add(payment)
    db.commit()
    db.refresh(payment)

    return payment


# =====================================
# Process Demo Payment
# =====================================
def process_payment(
    db: Session,
    payment_id: int,
    payment_successful: bool,
    failure_reason: Optional[str] = None,
) -> Payment:
    payment = (
        db.query(Payment)
        .filter(Payment.id == payment_id)
        .first()
    )

    if payment is None:
        raise ValueError("Payment not found")

    if payment.payment_status == "SUCCESS":
        raise ValueError(
            "This payment has already been completed"
        )

    appointment = (
        db.query(Appointment)
        .filter(
            Appointment.id == payment.appointment_id
        )
        .first()
    )

    if appointment is None:
        raise ValueError("Appointment not found")

    current_status = (
        str(appointment.status).strip().upper()
        if appointment.status
        else ""
    )

    if current_status != "PENDING":
        raise ValueError(
            f"Payment cannot be processed while the "
            f"appointment status is "
            f"{current_status or 'UNKNOWN'}"
        )

    if payment_successful:
        payment.payment_status = "SUCCESS"
        payment.failure_reason = None
        payment.paid_at = datetime.now(timezone.utc)

        appointment.status = "CONFIRMED"

    else:
        payment.payment_status = "FAILED"
        payment.failure_reason = (
            failure_reason or "Demo payment failed"
        )
        payment.paid_at = None

        appointment.status = "PENDING"

    try:
        db.commit()
        db.refresh(payment)
        db.refresh(appointment)
    except Exception:
        db.rollback()
        raise

    return payment

# =====================================
# Get Payment by ID
# =====================================
def get_payment_by_id(
    db: Session,
    payment_id: int,
) -> Optional[Payment]:
    return (
        db.query(Payment)
        .filter(
            Payment.id == payment_id,
        )
        .first()
    )


# =====================================
# Get Payment by Appointment
# =====================================
def get_payment_by_appointment(
    db: Session,
    appointment_id: int,
) -> Optional[Payment]:
    return (
        db.query(Payment)
        .filter(
            Payment.appointment_id == appointment_id,
        )
        .first()
    )


# =====================================
# Get Payments by Patient
# =====================================
def get_payments_by_patient(
    db: Session,
    patient_id: int,
) -> list[Payment]:
    return (
        db.query(Payment)
        .filter(
            Payment.patient_id == patient_id,
        )
        .order_by(
            Payment.created_at.desc(),
        )
        .all()
    )


# =====================================
# Get All Payments
# =====================================
def get_all_payments(
    db: Session,
) -> list[Payment]:
    return (
        db.query(Payment)
        .order_by(
            Payment.created_at.desc(),
        )
        .all()
    )