from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import settings

engine = create_engine(settings.DATABASE_URL)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


def ensure_appointments_schema():
    inspector = inspect(engine)

    if "appointments" not in inspector.get_table_names():
        return

    columns = {column["name"] for column in inspector.get_columns("appointments")}

    with engine.begin() as connection:
        if "status" not in columns:
            connection.execute(
                text(
                    "ALTER TABLE appointments ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'PENDING'"
                )
            )


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()