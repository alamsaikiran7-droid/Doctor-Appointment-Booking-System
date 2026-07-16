from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.admin_schema import AdminLoginRequest
from app.utils.password_hash import verify_password
from app.utils.jwt_handler import create_access_token


# ==========================================
# Admin Login
# ==========================================
# def admin_login(
#     db: Session,
#     admin: AdminLoginRequest
# ):

#     db_admin = (
#         db.query(User)
#         .filter(
#             User.email == admin.email,
#             User.role == "admin"
#         )
#         .first()
#     )

#     if db_admin is None:
#         return None

#     if not verify_password(
#         admin.password,
#         db_admin.password
#     ):
#         return None

#     access_token = create_access_token(
#         data={
#             "sub": str(db_admin.id),
#             "email": db_admin.email,
#             "role": db_admin.role
#         }
#     )

#     return {
#         "access_token": access_token,
#         "token_type": "bearer"
#     }


#new efault
def admin_login(db: Session, admin: AdminLoginRequest):

    print("\n========== ADMIN LOGIN ==========")
    print("Email received :", admin.email)
    print("Password received :", admin.password)

    db_admin = (
        db.query(User)
        .filter(
            User.email == admin.email,
            User.role == "admin"
        )
        .first()
    )

    print("DB Admin :", db_admin)

    if db_admin is None:
        print("Admin NOT FOUND")
        return None

    password_ok = verify_password(
        admin.password,
        db_admin.password
    )

    print("Password Match :", password_ok)

    if not password_ok:
        print("Wrong Password")
        return None

    print("LOGIN SUCCESS")

    access_token = create_access_token(
        data={
            "sub": str(db_admin.id),
            "email": db_admin.email,
            "role": db_admin.role
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

# ==========================================
# Get Admin By Email
# ==========================================
def get_admin_by_email(
    db: Session,
    email: str
):

    return (
        db.query(User)
        .filter(
            User.email == email,
            User.role == "admin"
        )
        .first()
    )