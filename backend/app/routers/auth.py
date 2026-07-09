from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.auth_schema import (
    RegisterRequest,
    LoginRequest,
    TokenResponse,
    UserResponse,
)
from app.services import auth_service


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


# ==========================================
# Register User
# ==========================================
@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def register_user(
    user: RegisterRequest,
    db: Session = Depends(get_db),
):
    """
    Register a new user.
    """

    new_user = auth_service.register_user(db, user)

    if new_user is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered."
        )

    return new_user


# ==========================================
# Login User
# ==========================================
@router.post(
    "/login",
    response_model=TokenResponse,
)
def login_user(
    user: LoginRequest,
    db: Session = Depends(get_db),
):
    """
    Authenticate user and return JWT token.
    """

    token = auth_service.login_user(db, user)

    if token is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    return token


# ==========================================
# Current User Profile
# ==========================================
@router.get(
    "/profile",
    response_model=UserResponse,
)
def get_profile(
    current_user: User = Depends(get_current_user),
):
    """
    Return authenticated user's profile.
    """

    return current_user