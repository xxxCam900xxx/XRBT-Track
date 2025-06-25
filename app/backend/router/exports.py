from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from service.exportService import exportData
from database.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(
    prefix="/export",
    tags=["export"]
)

@router.get("/{budget_id}")
async def download_csv(budget_id: int, db: AsyncSession = Depends(get_db)):
    csv_string = await exportData(budget_id, db)
    return StreamingResponse(
        iter([csv_string]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=budget_{budget_id}.csv"}
    )