"""Basic backend smoke tests for FastAPI endpoints."""

from fastapi.testclient import TestClient
from sqlalchemy import text

from app.main import app
from app.database import engine

client = TestClient(app)


def test_get_doctors_list():
    response = client.get("/doctors/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_get_slots_list():
    response = client.get("/slots/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_database_connection():
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        assert result.scalar() == 1
