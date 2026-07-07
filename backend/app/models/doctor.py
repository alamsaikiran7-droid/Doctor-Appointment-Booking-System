from sqlalchemy import Column, Integer, String, Float, Text, Boolean
from sqlalchemy.orm import relationship

from app.database import Base


class Doctor(Base):
    __tablename__ = "doctors"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(100), nullable=False)

    email = Column(String(100), unique=True, nullable=False, index=True)

    phone = Column(String(15), unique=True, nullable=False)

    speciality = Column(String(100), nullable=False, index=True)

    city = Column(String(100), nullable=False, index=True)

    experience_years = Column(Integer, nullable=False)

    consultation_fee = Column(Float, nullable=False)

    bio = Column(Text, nullable=True)

    is_active = Column(Boolean, default=True, nullable=False)

    slots = relationship(
        "Slot",
        back_populates="doctor",
        cascade="all, delete-orphan"
    )

    appointments = relationship(
        "Appointment",
        back_populates="doctor",
        cascade="all, delete-orphan"
    )
