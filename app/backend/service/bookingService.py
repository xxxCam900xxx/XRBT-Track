from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from database.models import Buchung

async def getAllBookings(db: AsyncSession):
    result = await db.execute(select(Buchung))
    return result.scalars().all()

async def getAllBookingsByTypeAndId(id, typ, db: AsyncSession):
    result = await db.execute(select(Buchung).where(Buchung.typ == typ).where(Buchung.monat_id == int(id)))
    return result.scalars().all()