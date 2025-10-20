from fastapi import FastAPI
from app.api.v1.patients import router  as patient_router 
from app.core.db import Base, engine
from app.api.v1.auth import router as user_router
from app.api.v1.appointments import router as appointment_router
from app.api.v1.admin import router as admin_router
from fastapi.middleware.cors import CORSMiddleware
from app.startup_seed import ensure_default_admin

app = FastAPI(title="Clinic Management System", version="1.0.0")

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,          # set to True only if you use cookies/auth headers
    allow_methods=["*"],             # or list: ["GET","POST","PUT","DELETE","OPTIONS"]
    allow_headers=["*"],             # or include specific: ["Authorization","Content-Type"]
)

Base.metadata.create_all(bind=engine)

@app.on_event("startup")
def _seed_dev_admin():
    ensure_default_admin()
    
app.router.include_router(patient_router)
app.router.include_router(user_router)
app.router.include_router(appointment_router)
app.include_router(admin_router)