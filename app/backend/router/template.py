from fastapi import APIRouter, Depends
from database.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from service.templateService import getAllTemplates, addTemplate, deleteTemplate
from pydantic import BaseModel

router = APIRouter(
    prefix="/template",
    tags=["template"]
)

class TemplateModel(BaseModel):
    title: str
    betrag: float
    typ: str

@router.get("/")
async def get_All_Templates(db: AsyncSession = Depends(get_db)):
    return await getAllTemplates(db)

@router.post("/")
async def add_Template(body: TemplateModel, db: AsyncSession = Depends(get_db)):
    return await addTemplate(body, db)

@router.delete("/{template_id}")
async def delete_Template(template_id, db: AsyncSession = Depends(get_db)):
    return await deleteTemplate(template_id, db)