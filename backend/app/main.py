from fastapi import FastAPI
from app.routers import doctors
from app.routers import slots
app = FastAPI()
app.include_router(doctors.router)
app.include_router(slots.router)

from app.database import Base, engine
from app.models import doctor
from app.routers import doctor


application = app

app.include_router(doctor.router)
Base.metadata.create_all(bind=engine)

@app.get("/")
def home():
    return {"message": "Doctor Appointment Booking API"}
