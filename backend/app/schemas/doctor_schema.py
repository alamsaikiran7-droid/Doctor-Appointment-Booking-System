from typing import Optional

from pydantic import BaseModel, EmailStr


# ==========================================
# Create Doctor
# ==========================================
class DoctorCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

    phone: str
    specialization: str
    city: str
    clinic: str
    experience: int
    fee: float
    gender: str

    languages: Optional[str] = None
    about: Optional[str] = None
    education: Optional[str] = None


# ==========================================
# Update Doctor
# ==========================================
class DoctorUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None

    phone: Optional[str] = None
    specialization: Optional[str] = None
    city: Optional[str] = None
    clinic: Optional[str] = None
    experience: Optional[int] = None
    fee: Optional[float] = None
    gender: Optional[str] = None

    languages: Optional[str] = None
    about: Optional[str] = None
    education: Optional[str] = None

    is_active: Optional[bool] = None


# ==========================================
# Doctor Response
# ==========================================
class DoctorResponse(BaseModel):
    id: int

    name: str
    email: EmailStr

    phone: str
    specialization: str
    city: str
    clinic: str
    experience: int
    fee: float
    gender: str

    languages: Optional[str] = None
    about: Optional[str] = None
    education: Optional[str] = None

    rating: float
    reviews: int

    is_active: bool


# ==========================================
# Doctor Login
# ==========================================
class DoctorLogin(BaseModel):
    email: EmailStr
    password: str


# ==========================================
# Doctor Login Response
# ==========================================
class DoctorLoginResponse(BaseModel):
    access_token: str
    token_type: str
    doctor_id: int
    name: str
    is_first_login: bool

class Config:
    from_attributes = True