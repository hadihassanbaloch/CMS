from fastapi import FastAPI

app = FastAPI()


@app.get("/healthz")
async def get_status():
    return {"Status": "Everything is OK!"}

@app.get("/version")
async def get_version():
    return {"CMS Version": "1.0.0"}
@app.get("/registration")
async def register_user():
    return {"message": "User registered successfully"}