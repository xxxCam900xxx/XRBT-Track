from fastapi import APIRouter, Depends
from service.budgetService import getAllBudgets
from database.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(
    prefix="/budget",
    tags=["budget"]
)

@router.get("/")
async def getAll(db: AsyncSession = Depends(get_db)):
    return await getAllBudgets(db)