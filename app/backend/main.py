from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from router.budget import router as budget_router

app = FastAPI()

# CORS Middleware (z. B. für lokale Entwicklung mit React)
origins = [
    "http://localhost:5173",
    "http://localhost:80",
    "http://localhost"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Makes a direct Redirect to Documentation when opening lochalhost:8000
@app.get("/")
async def read_root():
    return RedirectResponse("/docs")

# Router einbinden
app.include_router(budget_router)