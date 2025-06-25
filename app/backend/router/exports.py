from fastapi import APIRouter, Depends
from database.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(
    prefix="/export",
    tags=["export"]
)

@router.get("/")
async def export_Data():
    return "Hello"