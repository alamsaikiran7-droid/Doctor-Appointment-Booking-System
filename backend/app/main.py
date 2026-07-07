from fastapi import FastAPI

from app.database import Base, engine
from app.models import doctor, user, slot, appointment
from app.routers import doctors

app = FastAPI()
application = app

app.include_router(doctors.router)
Base.metadata.create_all(bind=engine)

@app.get("/")
def home():
    return {"message": "Doctor Appointment Booking API"}
