from sqlalchemy import Column, Integer, String, Float, Text, Boolean
from sqlalchemy.orm import relationship

from app.database import Base


class Doctor(Base):
    __tablename__ = "doctors"

    id = Column(Integer, primary_key=True, index=True)

    # Basic Details
    name = Column(String(100), nullable=False)

    email = Column(String(100), unique=True, nullable=False, index=True)

    # Login Credentials
    password = Column(String(255), nullable=False)

    is_first_login = Column(Boolean, default=True, nullable=False)

    # Contact Details
    phone = Column(String(20), unique=True, nullable=False)

    # Professional Details
    specialization = Column(String(100), nullable=False, index=True)

    city = Column(String(100), nullable=False)

    clinic = Column(String(150), nullable=False)

    experience = Column(Integer, nullable=False)

    fee = Column(Float, nullable=False)

    gender = Column(String(20), nullable=False)

    languages = Column(String(255), nullable=True)

    about = Column(Text, nullable=True)

    education = Column(String(255), nullable=True)

    # Statistics
    rating = Column(Float, default=0.0)

    reviews = Column(Integer, default=0)

    is_active = Column(Boolean, default=True, nullable=False)

    # Relationships
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