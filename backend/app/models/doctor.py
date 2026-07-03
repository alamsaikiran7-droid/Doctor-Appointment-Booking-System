from sqlalchemy import Column, Integer, String, Float, Text
from sqlalchemy.orm import relationship

from app.database import Base


class Doctor(Base):
    __tablename__ = "doctors"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(100), nullable=False)

    email = Column(String(100), unique=True, nullable=False, index=True)

    phone = Column(String(15), unique=True, nullable=False)

    specialty = Column(String(100), nullable=False, index=True)

    city = Column(String(100), nullable=False, index=True)

    experience_years = Column(Integer, nullable=False)

    consultation_fee = Column(Float, nullable=False)

    bio = Column(Text, nullable=True)

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
