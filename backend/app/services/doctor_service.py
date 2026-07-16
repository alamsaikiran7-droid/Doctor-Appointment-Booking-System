from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.models.doctor import Doctor
from app.schemas.doctor_schema import DoctorCreate, DoctorUpdate
from app.utils.password_hash import hash_password


# ==========================================
# Create Doctor
# ==========================================
def create_doctor(db: Session, doctor: DoctorCreate):

    # Check duplicate email
    existing_email = db.query(Doctor).filter(
        Doctor.email == doctor.email
    ).first()

    if existing_email:
        raise HTTPException(
            status_code=400,
            detail="Doctor with this email already exists."
        )

    # Check duplicate phone
    existing_phone = db.query(Doctor).filter(
        Doctor.phone == doctor.phone
    ).first()

    if existing_phone:
        raise HTTPException(
            status_code=400,
            detail="Doctor with this phone number already exists."
        )

    new_doctor = Doctor(
        name=doctor.name,
        email=doctor.email,
        password=hash_password(doctor.password),

        phone=doctor.phone,
        specialization=doctor.specialization,
        city=doctor.city,
        clinic=doctor.clinic,
        experience=doctor.experience,
        fee=doctor.fee,
        gender=doctor.gender,
        languages=doctor.languages,
        about=doctor.about,
        education=doctor.education,

        rating=0,
        reviews=0,
        is_active=True,
        is_first_login=True
    )

    db.add(new_doctor)
    db.commit()
    db.refresh(new_doctor)

    return new_doctor


# ==========================================
# Get All Doctors
# ==========================================
def get_all_doctors(db: Session):
    return db.query(Doctor).all()


# ==========================================
# Get Doctor By ID
# ==========================================
def get_doctor_by_id(db: Session, doctor_id: int):
    return db.query(Doctor).filter(
        Doctor.id == doctor_id
    ).first()


# ==========================================
# Update Doctor
# ==========================================
def update_doctor(
    db: Session,
    doctor_id: int,
    doctor_data: DoctorUpdate
):
    doctor = db.query(Doctor).filter(
        Doctor.id == doctor_id
    ).first()

    if not doctor:
        return None

    update_data = doctor_data.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(doctor, key, value)

    db.commit()
    db.refresh(doctor)

    return doctor


# ==========================================
# Delete Doctor
# ==========================================
def delete_doctor(db: Session, doctor_id: int):

    doctor = db.query(Doctor).filter(
        Doctor.id == doctor_id
    ).first()

    if not doctor:
        return None

    db.delete(doctor)
    db.commit()

    return doctor


# ==========================================
# Search By Specialization
# ==========================================
def search_by_specialization(db: Session, specialization: str):
    return db.query(Doctor).filter(
        Doctor.specialization.ilike(f"%{specialization}%")
    ).all()


# ==========================================
# Search By City
# ==========================================
def search_by_city(db: Session, city: str):
    return db.query(Doctor).filter(
        Doctor.city.ilike(f"%{city}%")
    ).all()


# ==========================================
# Search Doctors
# ==========================================
def search_doctors(
    db: Session,
    city: str = None,
    specialization: str = None
):
    query = db.query(Doctor)

    if city:
        query = query.filter(
            Doctor.city.ilike(f"%{city}%")
        )

    if specialization:
        query = query.filter(
            Doctor.specialization.ilike(f"%{specialization}%")
        )

    return query.all()


# ==========================================
# Search By Name
# ==========================================
def search_by_name(db: Session, name: str):
    return db.query(Doctor).filter(
        Doctor.name.ilike(f"%{name}%")
    ).all()


# ==========================================
# Global Search
# ==========================================
def global_search(db: Session, keyword: str):
    return db.query(Doctor).filter(
        or_(
            Doctor.name.ilike(f"%{keyword}%"),
            Doctor.specialization.ilike(f"%{keyword}%"),
            Doctor.city.ilike(f"%{keyword}%")
        )
    ).all()