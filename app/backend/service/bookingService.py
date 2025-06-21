from datetime import date
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import delete
from sqlalchemy import insert
from sqlalchemy import update
from database.models import Buchung

async def getAllBookings(db: AsyncSession):
    result = await db.execute(select(Buchung))
    return result.scalars().all()

async def getAllBookingsByTypeAndId(id, typ, db: AsyncSession):
    result = await db.execute(select(Buchung).where(Buchung.typ == typ).where(Buchung.monat_id == int(id)).order_by(Buchung.datum))
    return result.scalars().all()

async def deleteBooking(id, db: AsyncSession):
    deleteStmt = delete(Buchung).where(Buchung.buchung_id == int(id))
    await db.execute(deleteStmt)
    await db.commit()
    return

async def addNewBooking(body, db: AsyncSession):
    if (body.buchung_id != ""):
        # Booking überarbeiten
        update_stmt =  update(Buchung).where(Buchung.buchung_id == int(body.buchung_id)).values(
            monat_id=int(body.monat_id), 
            typ=body.typ,
            titel=body.titel, 
            datum=date.fromisoformat(body.datum), 
            betrag=float(body.betrag)
        )
        await db.execute(update_stmt)
    else:
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
    
    