from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import delete, insert
from database.models import Budget

async def getAllBudgets(db: AsyncSession):
    result = await db.execute(select(Budget).order_by(Budget.budget_id))
    return result.scalars().all()

async def createBudget(body, db: AsyncSession):
    insertStmt = insert(Budget).values(titel=body.titel)
    await db.execute(insertStmt)
    await db.commit()
    return

async def deleteBudgetById(id: int, db: AsyncSession):
    deleteStmt = delete(Budget).where(Budget.budget_id == int(id))
    await db.execute(deleteStmt)
    await db.commit()
    return
    