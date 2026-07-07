from fastapi import FastAPI

from app.config import settings
from app.database import Base, engine
from app.models import appointment, doctor, slot, user
from app.routers import appointments, doctors, slots

app = FastAPI(title=settings.APP_NAME, version=settings.APP_VERSION)

app.include_router(doctors.router)
app.include_router(slots.router)
app.include_router(appointments.router)

Base.metadata.create_all(bind=engine)


@app.get("/")
def home():
    return {"message": "Doctor Appointment Booking API"}


application = app
