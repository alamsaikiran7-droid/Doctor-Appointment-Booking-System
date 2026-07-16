"""sync appointment columns

Revision ID: d6f665196615
Revises: d9db14a9357c
Create Date: 2026-07-14 15:35:27.421767

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "d6f665196615"
down_revision: Union[str, Sequence[str], None] = "d9db14a9357c"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "appointments",
        sa.Column(
            "notes",
            sa.Text(),
            nullable=True,
        ),
    )

    op.add_column(
        "appointments",
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
    )

    op.alter_column(
        "appointments",
        "status",
        existing_type=sa.String(length=20),
        server_default="PENDING",
        existing_nullable=False,
    )

    op.create_index(
        op.f("ix_appointments_doctor_id"),
        "appointments",
        ["doctor_id"],
        unique=False,
    )

    op.create_index(
        op.f("ix_appointments_patient_id"),
        "appointments",
        ["patient_id"],
        unique=False,
    )

    op.create_index(
        op.f("ix_appointments_slot_id"),
        "appointments",
        ["slot_id"],
        unique=True,
    )

    op.drop_column(
        "appointments",
        "reminder_sent",
    )


def downgrade() -> None:
    op.add_column(
        "appointments",
        sa.Column(
            "reminder_sent",
            sa.Boolean(),
            server_default=sa.text("false"),
            nullable=False,
        ),
    )

    op.drop_index(
        op.f("ix_appointments_slot_id"),
        table_name="appointments",
    )

    op.drop_index(
        op.f("ix_appointments_patient_id"),
        table_name="appointments",
    )

    op.drop_index(
        op.f("ix_appointments_doctor_id"),
        table_name="appointments",
    )

    op.alter_column(
        "appointments",
        "status",
        existing_type=sa.String(length=20),
        server_default=None,
        existing_nullable=False,
    )

    op.drop_column(
        "appointments",
        "updated_at",
    )

    op.drop_column(
        "appointments",
        "notes",
    )