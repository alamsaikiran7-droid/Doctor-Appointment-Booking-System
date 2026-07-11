import importlib
import os


def test_settings_load_with_defaults():
    os.environ.setdefault("APP_NAME", "Doctor Booking API")
    os.environ.setdefault("APP_VERSION", "1.0.0")
    os.environ.setdefault("DATABASE_URL", "sqlite:///./doctor_app.db")
    os.environ.setdefault("SECRET_KEY", "test-secret")
    os.environ.setdefault("ALGORITHM", "HS256")
    os.environ.setdefault("ACCESS_TOKEN_EXPIRE_MINUTES", "30")
    os.environ.setdefault("DEBUG", "true")

    import app.config as config

    config = importlib.reload(config)
    assert config.settings.APP_NAME == "Doctor Booking API"
    assert config.settings.ACCESS_TOKEN_EXPIRE_MINUTES == 30


def test_jwt_round_trip():
    os.environ.setdefault("APP_NAME", "Doctor Booking API")
    os.environ.setdefault("APP_VERSION", "1.0.0")
    os.environ.setdefault("DATABASE_URL", "sqlite:///./doctor_app.db")
    os.environ.setdefault("SECRET_KEY", "test-secret")
    os.environ.setdefault("ALGORITHM", "HS256")
    os.environ.setdefault("ACCESS_TOKEN_EXPIRE_MINUTES", "30")
    os.environ.setdefault("DEBUG", "true")

    import app.utils.jwt_handler as jwt_handler

    jwt_handler = importlib.reload(jwt_handler)
    token = jwt_handler.create_access_token({"sub": "1", "email": "user@example.com", "role": "patient"})
    payload = jwt_handler.decode_access_token(token)

    assert payload["sub"] == "1"
    assert payload["email"] == "user@example.com"
    assert payload["role"] == "patient"
