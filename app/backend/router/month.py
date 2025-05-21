from fastapi import APIRouter, Depends
from database.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from service.monthService import getAllMonthsByBudgetID, getAllMonths, getAllMonthsByID

router = APIRouter(
    prefix="/month",
    tags=["month"]
)

@router.get("/")
async def get_All_Months(db: AsyncSession = Depends(get_db)):
    return await getAllMonths(db)

@router.get("/{budget_id}")
async def get_All_Months_By_BudgetID(budget_id, db: AsyncSession = Depends(get_db)):
    return await getAllMonthsByBudgetID(budget_id, db)

@router.get("/info/{month_id}")
async def get_Month_Details_By_ID(month_id, db: AsyncSession = Depends(get_db)):
    return await getAllMonthsByID(month_id, db)