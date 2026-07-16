from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings

from app.routers import (
    admin,
    appointments,
    auth,
    doctor_auth,
    doctors,
    payment_router,
    slots,
)

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
)

application = app

# ==========================================
# CORS Configuration
# ==========================================

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# Include Routers
# ==========================================

app.include_router(auth.router)
app.include_router(admin.router)
app.include_router(doctors.router)
app.include_router(slots.router)
app.include_router(appointments.router)
app.include_router(doctor_auth.router)
app.include_router(payment_router.router)

# ==========================================
# Home Route
# ==========================================


@app.get("/")
def home():
    return {
        "message": "Doctor Appointment Booking API",
    }