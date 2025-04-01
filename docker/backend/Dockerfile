# Verwende ein Python-Image
FROM python:3.9

# Arbeitsverzeichnis im Container erstellen
WORKDIR /usr/src/app

# Kopiere die Anforderungen (falls du Anforderungen hast)
COPY ../app/backend/requirements.txt ./

# Installiere die Python-Abhängigkeiten
RUN pip install --no-cache-dir -r requirements.txt

# Kopiere die gesamte Backend-App
COPY ../app/backend ./

# Exponiere den Port 5000
EXPOSE 5000

# Starte die Flask-App (oder dein Python-Backend)
CMD ["python", "app.py"]