from app.database import SessionLocal
from app.models.user import User
from app.utils.password_hash import verify_password

db = SessionLocal()

admin = db.query(User).filter(User.role == "admin").first()

print("Email:", admin.email)
print("Hash:", admin.password)
print("Verify:", verify_password("admin123", admin.password))