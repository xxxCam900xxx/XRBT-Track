from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from database.models import Monat

async def getAllMonthsByID(id, db: AsyncSession):
    result = await db.execute(select(Monat).where(Monat.budget_id == int(id)).order_by(Monat.start_datum))
    return result.scalars().all()
    