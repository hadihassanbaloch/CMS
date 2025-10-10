from fastapi import FastAPI
from app.api.v1.patients import router  as patient_router 
from app.core.db import Base, engine
from app.api.v1.auth import router as user_router

app = FastAPI(title="Clinic Management System", version="1.0.0")

Base.metadata.create_all(bind=engine)

app.router.include_router(patient_router)
app.router.include_router(user_router)