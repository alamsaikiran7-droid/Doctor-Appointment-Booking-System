from pydantic import BaseModel, EmailStr
from typing import Optional


class DoctorCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    speciality: str
    city: str
    experience_years: int
    consultation_fee: float
    bio: Optional[str] = None


class DoctorUpdate(BaseModel):
    name: Optional[str] = None
    email:Optional[EmailStr] = None
    phone: Optional[str] = None
    speciality: Optional[str] = None
    city: Optional[str] = None
    experience_years: Optional[int] = None
    consultation_fee: Optional[float] = None
    bio: Optional[str] = None


class DoctorResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    phone: str
    speciality: str
    city: str
    experience_years: int
    consultation_fee: float
    bio: Optional[str] = None
    is_active: bool

    class Config:
        from_attributes = True