from fastapi import APIRouter, Depends, UploadFile, File
from service.importService import importCSV
from database.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(
    prefix="/import",
    tags=["import"]
)

@router.post("/{budget_id}")
async def import_csv(budget_id, file: UploadFile = File(...), db: AsyncSession = Depends(get_db)):
    return await importCSV(budget_id, file, db)