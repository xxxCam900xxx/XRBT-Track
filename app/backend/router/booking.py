from fastapi import APIRouter, Depends
from database.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from service.bookingService import getAllBookings, getAllBookingsByTypeAndId

router = APIRouter(
    prefix="/booking",
    tags=["booking"]
)

@router.get("/")
async def get_All_Bookings(db: AsyncSession = Depends(get_db)):
    return await getAllBookings(db)

@router.get("/{id}/{typ}")
async def get_All_Bookings_By_Type_And_Id(id, typ, db: AsyncSession = Depends(get_db)):
    return await getAllBookingsByTypeAndId(id, typ, db)