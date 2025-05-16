from fastapi import FastAPI
from fastapi.responses import RedirectResponse

app = FastAPI()

# Makes a direct Redirect to Documentation when opening lochalhost:8000
@app.get("/")
async def read_root():
    return RedirectResponse("/docs")