from fastapi import APIRouter, Depends
from service.budgetService import getAllBudgets, deleteBudgetById
from database.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(
    prefix="/budget",
    tags=["budget"]
)

@router.get("/")
async def get_All(db: AsyncSession = Depends(get_db)):
    return await getAllBudgets(db)

@router.delete("/{budget_id}")
async def delete_BudgetById(budget_id, db: AsyncSession = Depends(get_db)):
    return await deleteBudgetById(budget_id, db)