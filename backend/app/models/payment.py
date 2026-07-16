from sqlalchemy import (
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class Payment(Base):
    __tablename__ = "payments"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    appointment_id = Column(
        Integer,
        ForeignKey(
            "appointments.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        unique=True,
        index=True,
    )

    patient_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True,
    )

    amount = Column(
        Float,
        nullable=False,
    )

    currency = Column(
        String(10),
        nullable=False,
        default="INR",
        server_default="INR",
    )

    payment_method = Column(
        String(30),
        nullable=False,
    )

    payment_status = Column(
        String(20),
        nullable=False,
        default="PENDING",
        server_default="PENDING",
    )

    transaction_id = Column(
        String(100),
        nullable=False,
        unique=True,
        index=True,
    )

    failure_reason = Column(
        String(255),
        nullable=True,
    )

    paid_at = Column(
        DateTime(timezone=True),
        nullable=True,
    )

    created_at = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    updated_at = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )

    # =====================================
    # Relationships
    # =====================================
    appointment = relationship(
        "Appointment",
        back_populates="payment",
    )

    patient = relationship(
        "User",
    )