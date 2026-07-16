from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.doctor import Doctor
from app.schemas.doctor_auth_schema import (
    DoctorLogin,
    DoctorLoginResponse,
    DoctorChangePassword,
)
from app.services.doctor_auth_service import (
    doctor_login,
    change_doctor_password,
)

router = APIRouter(
    prefix="/doctor",
    tags=["Doctor Authentication"]
)


# ==========================================
# Doctor Login
# ==========================================
@router.post(
    "/login",
    response_model=DoctorLoginResponse,
)
def login(
    credentials: DoctorLogin,
    db: Session = Depends(get_db),
):
    return doctor_login(db, credentials)


# ==========================================
# Change Password
# ==========================================
@router.post("/change-password")
def change_password(
    password_data: DoctorChangePassword,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return change_doctor_password(
        current_user,
        password_data,
        db,
    )