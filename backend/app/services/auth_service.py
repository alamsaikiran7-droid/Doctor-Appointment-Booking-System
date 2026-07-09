from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.auth_schema import RegisterRequest, LoginRequest
from app.utils.password_hash import hash_password, verify_password
from app.utils.jwt_handler import create_access_token


# ==========================================
# Register User
# ==========================================
def register_user(db: Session, user: RegisterRequest):

    existing_user = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already registered."
        )

    new_user = User(
        full_name=user.full_name,
        email=user.email,
        password=hash_password(user.password),
        role=user.role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


# ==========================================
# Login User
# ==========================================
def login_user(db: Session, user: LoginRequest):

    db_user = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if db_user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    if not verify_password(user.password, db_user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    access_token = create_access_token(
        data={
            "sub": str(db_user.id),
            "email": db_user.email,
            "role": db_user.role
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


# ==========================================
# Get User By Email
# ==========================================
def get_user_by_email(db: Session, email: str):

    return (
        db.query(User)
        .filter(User.email == email)
        .first()
    )


# ==========================================
# Get User By ID
# ==========================================
def get_user_by_id(db: Session, user_id: int):

    return (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )