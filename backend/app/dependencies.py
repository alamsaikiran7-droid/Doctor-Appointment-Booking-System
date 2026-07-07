from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.database import get_db
from app.utils.jwt_handler import decode_access_token

# OAuth2 scheme for extracting Bearer Token
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/login"
)


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    """
    Validate JWT token and return current user.

    Current Flow:
    -------------
    1. Extract JWT token from Authorization Header.
    2. Decode and verify the JWT.
    3. Extract User ID from token payload.
    4. Query database for the user.
    5. Return authenticated user.

    NOTE:
    -----
    Step 4 is pending because models/user.py
    is not completed yet.
    """

    try:
        # Decode JWT Token
        payload = decode_access_token(token)

        # Extract user id from JWT payload
        user_id = payload.get("sub")

        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication token",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # =====================================================
        # TODO:
        # Replace this section once User model is available.
        #
        # Example:
        #
        # from app.models.user import User
        #
        # user = db.query(User).filter(User.id == user_id).first()
        #
        # if user is None:
        #     raise HTTPException(
        #         status_code=status.HTTP_401_UNAUTHORIZED,
        #         detail="User not found",
        #         headers={"WWW-Authenticate": "Bearer"},
        #     )
        #
        # return user
        # =====================================================

        return payload

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )