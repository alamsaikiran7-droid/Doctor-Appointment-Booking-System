from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import (
    get_current_admin,
)
from app.models.user import User
from app.schemas.admin_schema import (
    AdminLoginRequest,
    AdminTokenResponse,
)
from app.services import admin_service


router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)


# ==========================================
# Admin Login
# ==========================================

@router.post(
    "/login",
    response_model=AdminTokenResponse
)
def admin_login(
    admin: AdminLoginRequest,
    db: Session = Depends(get_db)
):

    token = admin_service.admin_login(
        db,
        admin
    )

    if token is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid admin credentials."
        )

    return token


# ==========================================
# Admin Profile
# ==========================================

@router.get(
    "/profile"
)
def admin_profile(
    current_admin: User = Depends(
        get_current_admin
    )
):

    return {
        "id": current_admin.id,
        "name": current_admin.full_name,
        "email": current_admin.email,
        "role": current_admin.role,
    }