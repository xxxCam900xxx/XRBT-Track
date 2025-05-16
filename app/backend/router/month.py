from fastapi import APIRouter, Depends
from database.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from service.monthService import getAllMonthsByID

router = APIRouter(
    prefix="/month",
    tags=["month"]
)

@router.get("/{month_id}")
async def get_All_Months_By_ID(month_id, db: AsyncSession = Depends(get_db)):
    return await getAllMonthsByID(month_id, db)