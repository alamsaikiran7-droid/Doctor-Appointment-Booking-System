from fastapi import FastAPI

from app.database import Base, engine
from app.models import appointment, doctor, slot, user
from app.routers import appointments, doctors, slots

app = FastAPI()
application = app

app.include_router(doctors.router)
app.include_router(slots.router)
app.include_router(appointments.router)

Base.metadata.create_all(bind=engine)


@app.get("/")
def home():
    return {"message": "Doctor Appointment Booking API"}
