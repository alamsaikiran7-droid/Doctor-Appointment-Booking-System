from fastapi import FastAPI

from app.database import Base, engine
from app.models import doctor
from app.routers import doctor

app = FastAPI()
application = app

app.include_router(doctor.router)
Base.metadata.create_all(bind=engine)

@app.get("/")
def home():
    return {"message": "Doctor Appointment Booking API"}
