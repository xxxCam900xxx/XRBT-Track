from fastapi import APIRouter, Depends
from service.budgetService import getAllBudgets, deleteBudgetById, createBudget, updateBudgetById, getAllBookingsPerBudget
from database.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel

router = APIRouter(
    prefix="/budget",
    tags=["budget"]
)

class BudgetModel(BaseModel):
    titel: str
    jahr: int
    
class BudgetUpdModel(BaseModel):
    total_einnahmen: float
    total_ausgaben: float

@router.get("/")
async def get_All(db: AsyncSession = Depends(get_db)):
    return await getAllBudgets(db)

@router.post("/")
async def add_budget(body: BudgetModel, db: AsyncSession = Depends(get_db)):
    return await createBudget(body, db)

@router.delete("/{budget_id}")
async def delete_BudgetById(budget_id, db: AsyncSession = Depends(get_db)):
    return await deleteBudgetById(budget_id, db)

@router.patch("/{budget_id}")
async def update_BudgetById(budget_id, body: BudgetUpdModel, db: AsyncSession = Depends(get_db)):
    return await updateBudgetById(budget_id, body, db)

@router.get("/stats/{typ}")
async def get_All_Bookings_Per_Budget(typ, db: AsyncSession = Depends(get_db)):
    return await getAllBookingsPerBudget(typ, db)