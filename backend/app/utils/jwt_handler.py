from datetime import datetime, timedelta, timezone
from typing import Any

from jose import JWTError, jwt

from app.config import settings


# ==========================================
# Create JWT Access Token
# ==========================================
def create_access_token(data: dict[str, Any]) -> str:
    """
    Create a JWT access token.
    """

    to_encode = data.copy()

    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )

    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )

    return encoded_jwt


# ==========================================
# Decode JWT Access Token
# ==========================================
def decode_access_token(token: str) -> dict[str, Any]:
    """
    Decode and validate a JWT access token.
    Returns the decoded payload.
    Raises ValueError if the token is invalid or expired.
    """

    if not token:
        raise ValueError("Access token is missing.")

    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )

        return payload

    except JWTError:
        raise ValueError("Invalid or expired access token.")