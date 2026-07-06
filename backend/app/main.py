from fastapi import FastAPI
from app.routers import doctors
app = FastAPI()
app.include_router(doctors.router)