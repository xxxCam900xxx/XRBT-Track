from fastapi import APIRouter, Depends, UploadFile, File
from service.importService import importCSV
from database.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(
    prefix="/import",
    tags=["import"]
)

@router.post("/")
async def import_csv(file: UploadFile = File(...), db: AsyncSession = Depends(get_db)):
    return await importCSV(file, db)