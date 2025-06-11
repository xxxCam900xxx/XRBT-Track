import calendar
from datetime import date, datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import delete, insert
from sqlalchemy import update
from database.models import Budget, Monat

MONTH_NAMES = [
    "Januar", "Februar", "März", "April", "Mai", "Juni",
    "Juli", "August", "September", "Oktober", "November", "Dezember"
]

async def getAllBudgets(db: AsyncSession):
    result = await db.execute(select(Budget).order_by(Budget.budget_id))
    return result.scalars().all()

async def createBudget(body, db: AsyncSession):
    # Budget erstellen
    insert_stmt = insert(Budget).values(titel=body.titel).returning(Budget.budget_id)
    result = await db.execute(insert_stmt)
    budget_id = result.scalar_one()

    year = datetime.now().year

    # 12 Monate mit Datum einfügen
    for i, name in enumerate(MONTH_NAMES, start=1):
        start_datum = date(year, i, 1)
        _, last_day = calendar.monthrange(year, i)
        end_datum = date(year, i, last_day)

        monat_insert = insert(Monat).values(
            budget_id=budget_id,
            monat_name=name,
            start_datum=start_datum,
            end_datum=end_datum
        )
        await db.execute(monat_insert)

    await db.commit()
    return

async def deleteBudgetById(id: int, db: AsyncSession):
    deleteStmt = delete(Budget).where(Budget.budget_id == int(id))
    await db.execute(deleteStmt)
    await db.commit()
    return
    
async def updateBudgetById(id: int, body, db: AsyncSession):
    updateStmt = update(Budget).where(Budget.budget_id == int(id)).values(
        total_einnahmen=body.total_einnahmen,
        total_ausgaben=body.total_ausgaben,
    )
    await db.execute(updateStmt)
    await db.commit()
    return