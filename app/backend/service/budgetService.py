from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from database.models import Budget

async def getAllBudgets(db: AsyncSession):
    result = await db.execute(select(Budget).order_by(Budget.budget_id))
    return result.scalars().all()