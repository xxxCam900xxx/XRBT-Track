# Wie starte ich den Docker
Docker ist ein echt gutes Tool um ein Projekt immer in der selben Umgebung starten zu können ohne in den Fehler zu laufen das ein Computer oder Laptop die richtigen Versionen von Programm A&O hat. Mehr Information über Docker können Sie auch in der [Docker Dokumentation](https://www.docker.com/) lesen.

### 0 | Anforderungen
Füge im Ordner `docker/database` eine Datei namens `db.env` hinzu welche folgende Umgebungsvariabeln hat:
```
POSTGRES_USER
POSTGRES_PASSWORD
POSTGRES_DB
```

### 1 | Docker starten
Starte deinen Docker. Gehe anschliessend in das Terminal und navigiere zum Ordner `docker`. Gib dort in der Kommandozeile Folgendes ein, um die App starten zu können:
```bash
docker compose -f .\compose.app.yaml up
```
Jetzt sollte das Compose File alle nötigen Images und Container erstellen. 

**Viel Spass beim testen oder weiterentwickeln der App!**