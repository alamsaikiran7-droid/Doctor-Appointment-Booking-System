from fastapi import FastAPI

from app.database import Base, engine
from app.models import doctor

app = FastAPI()
application = app

Base.metadata.create_all(bind=engine)

@app.get("/")
def home():
    return {"message": "Doctor Appointment Booking API"}