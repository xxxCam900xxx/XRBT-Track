from sqlalchemy.ext.asyncio import AsyncSession
import csv
from io import StringIO

async def importCSV(file, db: AsyncSession):
    try:
        # Dateiinhalt als Bytes lesen
        contents = await file.read()
        decoded = contents.decode("utf-8")
        csv_io = StringIO(decoded)
        reader = csv.DictReader(csv_io)

        for row in reader:
            print(row)  # Hier Datenbanklogik einfügen

        return {"message": "CSV erfolgreich verarbeitet."}

    except Exception as e:
        return {"detail": f"Fehler beim Einlesen der Datei: {str(e)}"}