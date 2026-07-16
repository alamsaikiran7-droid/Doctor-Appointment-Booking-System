"""add doctor authentication fields

Revision ID: 577c882a5590
Revises: 81f827406cf2
Create Date: 2026-07-13 17:00:00.766802

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = "577c882a5590"
down_revision: Union[str, Sequence[str], None] = "81f827406cf2"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "doctors",
        sa.Column("password", sa.String(length=255), nullable=True),
    )

    op.add_column(
        "doctors",
        sa.Column(
            "is_first_login",
            sa.Boolean(),
            nullable=False,
            server_default=sa.text("true"),
        ),
    )

    # Remove the default after existing rows are updated
    op.alter_column(
        "doctors",
        "is_first_login",
        server_default=None,
    )


def downgrade() -> None:
    op.drop_column("doctors", "is_first_login")
    op.drop_column("doctors", "password")