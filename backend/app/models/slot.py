from sqlalchemy import (
    Column,
    Integer,
    Date,
    Time,
    Boolean,
    ForeignKey,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship

from app.database import Base


class Slot(Base):
    __tablename__ = "slots"

    id = Column(Integer, primary_key=True, index=True)

    doctor_id = Column(
        Integer,
        ForeignKey("doctors.id"),
        nullable=False,
    )

    slot_date = Column(
        Date,
        nullable=False,
    )

    start_time = Column(
        Time,
        nullable=False,
    )

    end_time = Column(
        Time,
        nullable=False,
    )

    is_available = Column(
        Boolean,
        default=True,
        nullable=False,
    )

    # ===========================
    # Relationships
    # ===========================
    doctor = relationship(
        "Doctor",
        back_populates="slots",
    )

    appointment = relationship(
        "Appointment",
        back_populates="slot",
        uselist=False,
    )

    __table_args__ = (
        UniqueConstraint(
            "doctor_id",
            "slot_date",
            "start_time",
            name="unique_doctor_slot",
        ),
    )

    # ===========================
    # Virtual fields for API
    # ===========================

    @property
    def slot_time(self):
        return self.start_time

    @property
    def duration_minutes(self):
        if self.start_time and self.end_time:
            start = (
                self.start_time.hour * 60
                + self.start_time.minute
            )

            end = (
                self.end_time.hour * 60
                + self.end_time.minute
            )

            return end - start

        return 30

    @property
    def status(self):
        return (
            "AVAILABLE"
            if self.is_available
            else "BOOKED"
        )