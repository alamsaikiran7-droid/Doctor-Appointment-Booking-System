from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.models.doctor import Doctor
from app.schemas.doctor_schema import DoctorCreate, DoctorUpdate


# ===========================
# Create Doctor
# ===========================
def create_doctor(db: Session, doctor: DoctorCreate):

    new_doctor = Doctor(
        name=doctor.name,
        email=doctor.email,
        phone=doctor.phone,
        speciality=doctor.speciality,
        city=doctor.city,
        experience_years=doctor.experience_years,
        consultation_fee=doctor.consultation_fee,
        bio=doctor.bio
    )

    db.add(new_doctor)
    db.commit()
    db.refresh(new_doctor)

    return new_doctor


# ===========================
# Get All Doctors
# ===========================
def get_all_doctors(db: Session):

    return db.query(Doctor).all()


# ===========================
# Get Doctor By ID
# ===========================
def get_doctor_by_id(db: Session, doctor_id: int):

    return db.query(Doctor).filter(
        Doctor.id == doctor_id
    ).first()


# ===========================
# Update Doctor
# ===========================
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


# ===========================
# Delete Doctor
# ===========================
def delete_doctor(db: Session, doctor_id: int):

    doctor = db.query(Doctor).filter(
        Doctor.id == doctor_id
    ).first()

    if not doctor:
        return None

    db.delete(doctor)
    db.commit()

    return doctor


# ===========================
# Search By Speciality
# ===========================
def search_by_speciality(
    db: Session,
    speciality: str
):

    return db.query(Doctor).filter(
        Doctor.speciality.ilike(f"%{speciality}%")
    ).all()


# ===========================
# Search By City
# ===========================
def search_by_city(
    db: Session,
    city: str
):

    return db.query(Doctor).filter(
        Doctor.city.ilike(f"%{city}%")
    ).all()


# ===========================
# Search By City & Speciality
# ===========================
def search_doctors(
    db: Session,
    city: str = None,
    speciality: str = None
):

    query = db.query(Doctor)

    if city:
        query = query.filter(
            Doctor.city.ilike(f"%{city}%")
        )

    if speciality:
        query = query.filter(
            Doctor.speciality.ilike(f"%{speciality}%")
        )

    return query.all()


# ===========================
# Search By Name
# ===========================
def search_by_name(
    db: Session,
    name: str
):

    return db.query(Doctor).filter(
        Doctor.name.ilike(f"%{name}%")
    ).all()


# ===========================
# Global Search
# ===========================
def global_search(
    db: Session,
    keyword: str
):

    return db.query(Doctor).filter(
        or_(
            Doctor.name.ilike(f"%{keyword}%"),
            Doctor.speciality.ilike(f"%{keyword}%"),
            Doctor.city.ilike(f"%{keyword}%")
        )
    ).all()