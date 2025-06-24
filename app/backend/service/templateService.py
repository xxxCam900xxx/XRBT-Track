from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import delete, insert
from database.models import Template

async def getAllTemplates(db: AsyncSession):
    result = await db.execute(select(Template))
    return result.scalars().all()

async def addTemplate(body, db: AsyncSession):
    insert_stmt = insert(Template).values(titel=body.title, typ=body.typ, betrag=body.betrag)
    await db.execute(insert_stmt)
    await db.commit()
    return

async def deleteTemplate(template_id: int, db: AsyncSession):
    delete_stmt = delete(Template).where(Template.template_id == int(template_id))
    await db.execute(delete_stmt)
    await db.commit()
    return