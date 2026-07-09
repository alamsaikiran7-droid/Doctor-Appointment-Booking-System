from app.services.auth_service import register_user
from app.schemas.auth_schema import RegisterRequest
from app.database import SessionLocal
from app.models.user import User


def test_register_user_creates_user_and_returns_model():
    db = SessionLocal()
    try:
        db.query(User).filter(User.email == "flow@example.com").delete()
        db.commit()

        user = register_user(
            db,
            RegisterRequest(
                full_name="Flow User",
                email="flow@example.com",
                password="password123",
                role="patient",
            ),
        )

        assert user.email == "flow@example.com"
        assert user.role == "patient"
    finally:
        db.close()
