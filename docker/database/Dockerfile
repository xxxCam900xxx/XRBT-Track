FROM postgres:15

# Optional: eigene Konfiguration oder SQL-Dateien kopieren
COPY init.sql /docker-entrypoint-initdb.d/

EXPOSE 5432