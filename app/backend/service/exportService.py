import csv
from io import StringIO
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from database.models import Buchung
from service.monthService import getAllAmountsByID

async def exportData(budget_id: int, db: AsyncSession) -> str:
    ausgaben = await getAllAmountsByID(budget_id, "ausgabe", db)
    einnahmen = await getAllAmountsByID(budget_id, "einnahme", db)

    output = StringIO()
    writer = csv.writer(output)

    writer.writerow(["BuchungID", "Monat", "Typ", "Titel", "Datum", "Betrag"])

    def buchung_to_row(monat: str, typ: str, b: Buchung):
        return [
            b.buchung_id,
            monat,
            typ.capitalize(),
            b.titel,
            b.datum.isoformat(),
            float(b.betrag)
        ]

    for eintrag in ausgaben:
        monat = eintrag["Monat"]
        for buchung in eintrag["Buchungen"]:
            writer.writerow(buchung_to_row(monat, "ausgabe", buchung))

    for eintrag in einnahmen:
        monat = eintrag["Monat"]
        for buchung in eintrag["Buchungen"]:
            writer.writerow(buchung_to_row(monat, "einnahme", buchung))

    return output.getvalue()