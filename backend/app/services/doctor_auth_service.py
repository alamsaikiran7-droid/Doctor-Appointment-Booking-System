from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.doctor import Doctor
from app.schemas.doctor_auth_schema import (
    DoctorChangePassword,
    DoctorLogin,
)
from app.utils.jwt_handler import create_access_token
from app.utils.password_hash import (
    hash_password,
    verify_password,
)


# ==========================================
# Doctor Login
# ==========================================
def doctor_login(
    db: Session,
    credentials: DoctorLogin,
):
    # Find doctor by email
    doctor = (
        db.query(Doctor)
        .filter(Doctor.email == credentials.email)
        .first()
    )

    # Email is not registered as a doctor
    if doctor is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor account not found",
        )

    # Check password
    password_matches = verify_password(
        credentials.password,
        doctor.password,
    )

    if not password_matches:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password",
        )

    # Check account status
    if not doctor.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Doctor account is inactive",
        )

    # Create JWT Token
    token = create_access_token(
        data={
            "sub": doctor.email,
            "role": "doctor",
            "doctor_id": doctor.id,
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "is_first_login": doctor.is_first_login,
        "doctor_id": doctor.id,
        "name": doctor.name,
    }


# ==========================================
# Change Doctor Password
# ==========================================
def change_doctor_password(
    doctor: Doctor,
    password_data: DoctorChangePassword,
    db: Session,
):
    # Verify current password
    if not verify_password(
        password_data.current_password,
        doctor.password,
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect",
        )

    # Hash new password
    doctor.password = hash_password(
        password_data.new_password
    )

    # First login completed
    doctor.is_first_login = False

    try:
        db.commit()
        db.refresh(doctor)
    except Exception:
        db.rollback()
        raise

    return {
        "message": "Password changed successfully",
    }