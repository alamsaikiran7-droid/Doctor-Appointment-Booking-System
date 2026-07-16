from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    doctor_id = Column(
        Integer,
        ForeignKey("doctors.id"),
        nullable=False,
        index=True,
    )

    patient_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True,
    )

    slot_id = Column(
        Integer,
        ForeignKey("slots.id"),
        nullable=False,
        unique=True,
        index=True,
    )

    status = Column(
        String(20),
        nullable=False,
        default="PENDING",
        server_default="PENDING",
    )

    reason = Column(
        Text,
        nullable=True,
    )

    notes = Column(
        Text,
        nullable=True,
    )

    reminder_sent = Column(
        Boolean,
        nullable=False,
        default=False,
        server_default="false",
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
    doctor = relationship(
        "Doctor",
        back_populates="appointments",
    )

    patient = relationship(
        "User",
        back_populates="appointments",
    )

    slot = relationship(
        "Slot",
        back_populates="appointment",
    )

    payment = relationship(
        "Payment",
        back_populates="appointment",
        uselist=False,
        cascade="all, delete-orphan",
        passive_deletes=True,
    )
        # =====================================
    # Response Properties
    # =====================================
    @property
    def patient_name(self):
        if self.patient is None:
            return None

        return self.patient.full_name

    @property
    def patient_phone(self):
        if self.patient is None:
            return None

        return self.patient.phone

    @property
    def patient_email(self):
        if self.patient is None:
            return None

        return self.patient.email

    @property
    def doctor_name(self):
        if self.doctor is None:
            return None

        return self.doctor.name

    @property
    def specialization(self):
        if self.doctor is None:
            return None

        return self.doctor.specialization

    @property
    def date(self):
        if self.slot is None:
            return None

        return self.slot.slot_date

    @property
    def time(self):
        if self.slot is None:
            return None

        return self.slot.start_time