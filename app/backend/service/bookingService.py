from datetime import date
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import insert
from database.models import Buchung

async def getAllBookings(db: AsyncSession):
    result = await db.execute(select(Buchung))
    return result.scalars().all()

async def getAllBookingsByTypeAndId(id, typ, db: AsyncSession):
    result = await db.execute(select(Buchung).where(Buchung.typ == typ).where(Buchung.monat_id == int(id)))
    return result.scalars().all()

async def addNewBooking(body, db: AsyncSession):
    # Booking erstellen
    insert_stmt = insert(Buchung).values(
        monat_id=int(body.monat_id), 
        typ=body.typ,
        titel=body.titel, 
        datum=date.fromisoformat(body.datum), 
        betrag=float(body.betrag)
    )
    await db.execute(insert_stmt)
    await db.commit()
    return
    
    