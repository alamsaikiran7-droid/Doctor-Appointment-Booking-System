from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.doctor_schema import (
    DoctorCreate,
    DoctorUpdate,
    DoctorResponse,
)
from app.services import doctor_service

router = APIRouter(
    prefix="/doctors",
    tags=["Doctors"]
)


# =====================================
# Create Doctor
# =====================================
@router.post(
    "/",
    response_model=DoctorResponse,
    status_code=status.HTTP_201_CREATED
)
def create_doctor(
    doctor: DoctorCreate,
    db: Session = Depends(get_db)
):
    return doctor_service.create_doctor(db, doctor)


# =====================================
# Get All Doctors
# =====================================
@router.get(
    "/",
    response_model=List[DoctorResponse]
)
def get_all_doctors(
    db: Session = Depends(get_db)
):
    return doctor_service.get_all_doctors(db)


# =====================================
# Get Doctor By ID
# =====================================
@router.get(
    "/{doctor_id}",
    response_model=DoctorResponse
)
def get_doctor(
    doctor_id: int,
    db: Session = Depends(get_db)
):
    doctor = doctor_service.get_doctor_by_id(db, doctor_id)

    if doctor is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor not found"
        )

    return doctor


# =====================================
# Update Doctor
# =====================================
@router.put(
    "/{doctor_id}",
    response_model=DoctorResponse
)
def update_doctor(
    doctor_id: int,
    doctor: DoctorUpdate,
    db: Session = Depends(get_db)
):
    updated_doctor = doctor_service.update_doctor(
        db,
        doctor_id,
        doctor
    )

    if updated_doctor is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor not found"
        )

    return updated_doctor


# =====================================
# Delete Doctor
# =====================================
@router.delete(
    "/{doctor_id}"
)
def delete_doctor(
    doctor_id: int,
    db: Session = Depends(get_db)
):
    deleted_doctor = doctor_service.delete_doctor(
        db,
        doctor_id
    )

    if deleted_doctor is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor not found"
        )

    return {
        "message": "Doctor deleted successfully"
    }


# =====================================
# Search Doctors
# =====================================
@router.get(
    "/search/",
    response_model=List[DoctorResponse]
)
def search_doctors(
    city: Optional[str] = Query(None),
    speciality: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    return doctor_service.search_doctors(
        db=db,
        city=city,
        speciality=speciality
    )


# =====================================
# Search By Name
# =====================================
@router.get(
    "/search/name/",
    response_model=List[DoctorResponse]
)
def search_by_name(
    name: str,
    db: Session = Depends(get_db)
):
    return doctor_service.search_by_name(
        db,
        name
    )


# =====================================
# Search By City
# =====================================
@router.get(
    "/search/city/",
    response_model=List[DoctorResponse]
)
def search_by_city(
    city: str,
    db: Session = Depends(get_db)
):
    return doctor_service.search_by_city(
        db,
        city
    )


# =====================================
# Search By Speciality
# =====================================
@router.get(
    "/search/speciality/",
    response_model=List[DoctorResponse]
)
def search_by_speciality(
    speciality: str,
    db: Session = Depends(get_db)
):
    return doctor_service.search_by_speciality(
        db,
        speciality
    )


# =====================================
# Global Search
# =====================================
@router.get(
    "/search/global/",
    response_model=List[DoctorResponse]
)
def global_search(
    keyword: str,
    db: Session = Depends(get_db)
):
    return doctor_service.global_search(
        db,
        keyword
    )