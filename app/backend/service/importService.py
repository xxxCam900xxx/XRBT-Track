import csv
from io import StringIO
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from database.models import Buchung, Monat
from service.monthService import getAllAmountsByID, getAllMonthsByBudgetID

async def importCSV(budget_id: int, file, db: AsyncSession) -> None:
    contents = await file.read()
    csv_text = contents.decode("utf-8")

    monate = await getAllMonthsByBudgetID(budget_id, db)
    monat_id_lookup = {monat.monat_name: monat.monat_id for monat in monate}
    reader = csv.DictReader(StringIO(csv_text))

    for row in reader:
        buchung_id = row.get("BuchungID")
        monat_name = row.get("Monat")
        typ = row.get("Typ", "").lower()
        titel = row.get("Titel", "")
        datum_str = row.get("Datum", "")
        betrag_str = row.get("Betrag", "")

        monat_id = monat_id_lookup.get(monat_name)
        if not monat_id:
            continue 
        
        try:
            datum = datetime.strptime(datum_str, "%Y-%m-%d").date()
        except ValueError:
            continue 

        try:
            betrag = abs(float(betrag_str.replace(",", ".")))

            if typ == "ausgabe":
                betrag = -betrag
            elif typ == "einnahme":
                betrag = betrag
            else:
                continue  # ungültiger Typ
        except ValueError:
            continue

        # Buchung aktualisieren oder neu einfügen
        if buchung_id and buchung_id.strip():
            # UPDATE-Fall
            stmt = select(Buchung).where(Buchung.buchung_id == int(buchung_id))
            result = await db.execute(stmt)
            existing = result.scalar_one_or_none()
            if existing:
                existing.monat_id = monat_id
                existing.typ = typ
                existing.titel = titel
                existing.datum = datum
                existing.betrag = betrag
                continue

        # INSERT-Fall
        neue_buchung = Buchung(
            monat_id=monat_id,
            typ=typ,
            titel=titel,
            datum=datum,
            betrag=betrag
        )
        db.add(neue_buchung)

    await db.commit()
    db.expire_all()
    
    monat_summen = {}

    for typ in ["einnahme", "ausgabe"]:
        monats_buchungen = await getAllAmountsByID(budget_id, typ, db)

        for eintrag in monats_buchungen:
            monat_name = eintrag["Monat"]
            buchungen = eintrag["Buchungen"]
            gesamtbetrag = sum(float(b.betrag) for b in buchungen)

            if monat_name not in monat_summen:
                monat_summen[monat_name] = {"total_einnahmen": 0.0, "total_ausgaben": 0.0}

            if typ == "einnahme":
                monat_summen[monat_name]["total_einnahmen"] = gesamtbetrag
            else:
                monat_summen[monat_name]["total_ausgaben"] = gesamtbetrag

    # Monatsdaten aktualisieren
    for monat_name, sums in monat_summen.items():
        result = await db.execute(
            select(Monat).where(Monat.budget_id == int(budget_id), Monat.monat_name == monat_name)
        )
        monat = result.scalar_one_or_none()
        if not monat:
            continue

        total_einnahmen = sums.get("total_einnahmen", 0.0)
        total_ausgaben = sums.get("total_ausgaben", 0.0)
        update_stmt = (
            update(Monat)
            .where(Monat.monat_id == monat.monat_id)
            .values(
                total_einnahmen=str(total_einnahmen),
                total_ausgaben=str(total_ausgaben),
            )
        )
        await db.execute(update_stmt)

    await db.commit()