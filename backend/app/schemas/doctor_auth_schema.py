from pydantic import BaseModel, EmailStr


class DoctorLogin(BaseModel):
    email: EmailStr
    password: str


class DoctorLoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    is_first_login: bool
    doctor_id: int
    name: str


# ==============================
# Change Password Schema
# ==============================

class DoctorChangePassword(BaseModel):
    current_password: str
    new_password: str