"""create payments table

Revision ID: d9db14a9357c
Revises: 39339e20d9cf
Create Date: 2026-07-14 15:19:03.238221

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "d9db14a9357c"
down_revision: Union[str, Sequence[str], None] = "39339e20d9cf"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "payments",
        sa.Column(
            "id",
            sa.Integer(),
            nullable=False,
        ),
        sa.Column(
            "appointment_id",
            sa.Integer(),
            nullable=False,
        ),
        sa.Column(
            "patient_id",
            sa.Integer(),
            nullable=False,
        ),
        sa.Column(
            "amount",
            sa.Float(),
            nullable=False,
        ),
        sa.Column(
            "currency",
            sa.String(length=10),
            server_default="INR",
            nullable=False,
        ),
        sa.Column(
            "payment_method",
            sa.String(length=30),
            nullable=False,
        ),
        sa.Column(
            "payment_status",
            sa.String(length=20),
            server_default="PENDING",
            nullable=False,
        ),
        sa.Column(
            "transaction_id",
            sa.String(length=100),
            nullable=False,
        ),
        sa.Column(
            "failure_reason",
            sa.String(length=255),
            nullable=True,
        ),
        sa.Column(
            "paid_at",
            sa.DateTime(timezone=True),
            nullable=True,
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ["appointment_id"],
            ["appointments.id"],
            ondelete="CASCADE",
        ),
        sa.ForeignKeyConstraint(
            ["patient_id"],
            ["users.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_index(
        op.f("ix_payments_appointment_id"),
        "payments",
        ["appointment_id"],
        unique=True,
    )

    op.create_index(
        op.f("ix_payments_id"),
        "payments",
        ["id"],
        unique=False,
    )

    op.create_index(
        op.f("ix_payments_patient_id"),
        "payments",
        ["patient_id"],
        unique=False,
    )

    op.create_index(
        op.f("ix_payments_transaction_id"),
        "payments",
        ["transaction_id"],
        unique=True,
    )


def downgrade() -> None:
    op.drop_index(
        op.f("ix_payments_transaction_id"),
        table_name="payments",
    )

    op.drop_index(
        op.f("ix_payments_patient_id"),
        table_name="payments",
    )

    op.drop_index(
        op.f("ix_payments_id"),
        table_name="payments",
    )

    op.drop_index(
        op.f("ix_payments_appointment_id"),
        table_name="payments",
    )

    op.drop_table("payments")