from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.doctor import Doctor
from app.models.user import User
from app.utils.jwt_handler import decode_access_token


# Extract Bearer token from the Authorization header
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/login"
)


# ==========================================
# Current Authenticated User or Doctor
# ==========================================
def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    """
    Validate the JWT token and return the authenticated
    User or Doctor object.
    """

    try:
        payload = decode_access_token(token)

        subject = payload.get("sub")
        role = payload.get("role")
        email = payload.get("email")
        doctor_id = payload.get("doctor_id")

        if subject is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication token",
                headers={
                    "WWW-Authenticate": "Bearer"
                },
            )

        # ======================================
        # Doctor Authentication
        # ======================================
        if role == "doctor":
            doctor = None

            # First try doctor_id from the token
            if doctor_id is not None:
                try:
                    doctor = (
                        db.query(Doctor)
                        .filter(
                            Doctor.id == int(doctor_id)
                        )
                        .first()
                    )
                except (TypeError, ValueError):
                    doctor = None

            # Doctor login currently stores email in "sub"
            if doctor is None:
                doctor = (
                    db.query(Doctor)
                    .filter(
                        Doctor.email == str(subject)
                    )
                    .first()
                )

            if doctor is None:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Doctor not found",
                    headers={
                        "WWW-Authenticate": "Bearer"
                    },
                )

            if not doctor.is_active:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Doctor account is inactive",
                )

            return doctor

        # ======================================
        # Patient / Admin Authentication
        # ======================================
        user = None

        # Patient token stores the user ID in "sub"
        try:
            user_id = int(subject)

            user = (
                db.query(User)
                .filter(User.id == user_id)
                .first()
            )

        except (TypeError, ValueError):
            user = None

        # Some tokens may store email in "sub"
        if user is None:
            user = (
                db.query(User)
                .filter(
                    User.email == str(subject)
                )
                .first()
            )

        # Use the separate email field as a fallback
        if user is None and email:
            user = (
                db.query(User)
                .filter(User.email == email)
                .first()
            )

        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
                headers={
                    "WWW-Authenticate": "Bearer"
                },
            )

        return user

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(exc),
            headers={
                "WWW-Authenticate": "Bearer"
            },
        ) from exc

    except HTTPException:
        raise

    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={
                "WWW-Authenticate": "Bearer"
            },
        ) from exc


# ==========================================
# Current Admin
# ==========================================
def get_current_admin(
    current_user=Depends(get_current_user),
):
    """
    Ensure the authenticated account is an admin user.
    """

    if not isinstance(current_user, User):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized as admin",
        )

    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized as admin",
        )

    return current_user