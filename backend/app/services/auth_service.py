from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.auth_schema import LoginRequest, RegisterRequest
from app.utils.jwt_handler import create_access_token
from app.utils.password_hash import hash_password, verify_password


# ==========================================
# Register User
# ==========================================
def register_user(
    db: Session,
    user: RegisterRequest,
):
    existing_user = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if existing_user is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already registered.",
        )

    # Patient registration endpoint should create
    # only patient accounts.
    if user.role.lower() != "patient":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only patient registration is allowed.",
        )

    new_user = User(
        full_name=user.full_name,
        email=user.email,
        phone=user.phone,
        password=hash_password(user.password),
        role="patient",
    )

    db.add(new_user)

    try:
        db.commit()
        db.refresh(new_user)
    except Exception:
        db.rollback()
        raise

    return new_user

# ==========================================
# Login User
# ==========================================
def login_user(
    db: Session,
    user: LoginRequest,
):
    db_user = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if db_user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient account not found.",
        )

    # Block admin or other roles from patient login
    if db_user.role.lower() != "patient":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account is not registered as a patient.",
        )

    if not verify_password(
        user.password,
        db_user.password,
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password.",
        )

    access_token = create_access_token(
        data={
            "sub": str(db_user.id),
            "email": db_user.email,
            "role": "patient",
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }


# ==========================================
# Get User By Email
# ==========================================
def get_user_by_email(
    db: Session,
    email: str,
):
    return (
        db.query(User)
        .filter(User.email == email)
        .first()
    )


# ==========================================
# Get User By ID
# ==========================================
def get_user_by_id(
    db: Session,
    user_id: int,
):
    return (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )