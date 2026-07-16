from app.database import SessionLocal
from app.config import settings
from app.models.user import User
from app.utils.password_hash import hash_password

print("DATABASE_URL:", settings.DATABASE_URL)

db = SessionLocal()

try:
    print("Users in database:", db.query(User).count())

    admin = db.query(User).filter(User.role == "admin").first()

    if admin:
        print("Admin already exists:", admin.email)
    else:
        admin = User(
            full_name="Gopi",
            email="kasarlagopichand24@gmail.com",
            password=hash_password("admin123"),
            role="admin"
        )

        db.add(admin)
        db.commit()
        db.refresh(admin)

        print("Admin created successfully!")
        print("ID:", admin.id)

except Exception as e:
    db.rollback()
    print("ERROR:", e)

finally:
    db.close()