from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update
from database.models import Monat

async def getAllMonths(db: AsyncSession):
    result = await db.execute(select(Monat))
    return result.scalars().all()

async def getAllMonthsByBudgetID(id, db: AsyncSession):
    result = await db.execute(select(Monat).where(Monat.budget_id == int(id)).order_by(Monat.start_datum))
    return result.scalars().all()
    
async def getAllMonthsByID(id, db: AsyncSession):
    result = await db.execute(select(Monat).where(Monat.monat_id == int(id)))
    return result.scalars().all()

async def updateMonthsByID(id, body, db: AsyncSession):
    update_stmt =  update(Monat).where(Monat.monat_id == int(id)).values(
        total_ausgaben=float(body.total_ausgaben),
        total_einnahmen=float(body.total_einnahmen)
    )
    await db.execute(update_stmt)
    await db.commit()
    return
    