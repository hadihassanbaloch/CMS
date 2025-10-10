from fastapi import APIRouter

router = APIRouter(prefix="/api/v1",tags=["Meta"])
@router.get("/healthz")
async def get_status():
    return {"Status": "Everything is OK!"}

@router.get("/version")
async def get_version():
    return {"CMS Version": "1.0.0"}