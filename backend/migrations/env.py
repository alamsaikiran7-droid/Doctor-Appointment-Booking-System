from logging.config import fileConfig
import os
import sys
from pathlib import Path

from alembic import context
from sqlalchemy import engine_from_config
from sqlalchemy import pool


# =====================================
# Project Path
# =====================================
project_root = Path(__file__).resolve().parents[1]

if str(project_root) not in sys.path:
    sys.path.insert(0, str(project_root))


# =====================================
# Application Imports
# =====================================
from app.database import Base
from app.models.user import User
from app.models.doctor import Doctor
from app.models.slot import Slot
from app.models.appointment import Appointment
from app.models.payment import Payment


# =====================================
# Alembic Configuration
# =====================================
config = context.config


# =====================================
# Database URL
# =====================================
try:
    os.chdir(str(project_root))

    from app.config import settings

    if settings.DATABASE_URL:
        config.set_main_option(
            "sqlalchemy.url",
            settings.DATABASE_URL,
        )
except Exception as exc:
    sys.stderr.write(
        f"Failed loading DATABASE_URL from settings: {exc}\n"
    )


# =====================================
# Logging Configuration
# =====================================
if config.config_file_name is not None:
    config_file_path = Path(config.config_file_name)

    if not config_file_path.is_absolute():
        config_file_path = (
            project_root / config_file_path
        ).resolve()

    if config_file_path.exists():
        fileConfig(str(config_file_path))


# =====================================
# SQLAlchemy Metadata
# =====================================
target_metadata = Base.metadata


# =====================================
# Offline Migration
# =====================================
def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")

    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={
            "paramstyle": "named",
        },
        compare_type=True,
        compare_server_default=True,
    )

    with context.begin_transaction():
        context.run_migrations()


# =====================================
# Online Migration
# =====================================
def run_migrations_online() -> None:
    connectable = engine_from_config(
        config.get_section(
            config.config_ini_section,
            {},
        ),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,
            compare_server_default=True,
        )

        with context.begin_transaction():
            context.run_migrations()


# =====================================
# Run Migration
# =====================================
if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()