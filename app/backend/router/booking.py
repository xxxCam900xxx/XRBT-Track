from fastapi import APIRouter, Depends
from database.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from service.bookingService import getAllBookings, getAllBookingsByTypeAndId, addNewBooking, deleteBooking
from pydantic import BaseModel

router = APIRouter(
    prefix="/booking",
    tags=["booking"]
)

class BookingModel(BaseModel):
    buchung_id: str
    titel: str
    datum: str
    typ: str
    betrag: float
    monat_id: str

@router.get("/")
async def get_All_Bookings(db: AsyncSession = Depends(get_db)):
    return await getAllBookings(db)

@router.get("/{id}/{typ}")
async def get_All_Bookings_By_Type_And_Id(id, typ, db: AsyncSession = Depends(get_db)):
    return await getAllBookingsByTypeAndId(id, typ, db)

@router.post("/")
async def add_New_Booking(body: BookingModel, db: AsyncSession = Depends(get_db)):
    return await addNewBooking(body, db)

@router.patch("/")
async def add_Update_Booking(body: BookingModel, db: AsyncSession = Depends(get_db)):
    return await addNewBooking(body, db)

@router.delete("/{booking_id}")
async def delete_Booking(booking_id, db: AsyncSession = Depends(get_db)):
    return await deleteBooking(booking_id, db)