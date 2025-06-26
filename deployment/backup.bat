@echo off
setlocal enabledelayedexpansion

:: === KONFIGURATION ===
set BACKUP_DIR=%~dp0\..\backups
set DATABASE_CONTAINER_NAME=Database
set POSTGRES_DB=mydatabase
set POSTGRES_USER=postgres

:: === ZEITSTEMPEL ERZEUGEN (ohne Leerzeichen) ===
for /f "tokens=1-4 delims=:. " %%a in ("%time%") do (
    set HOUR=%%a
    set MIN=%%b
    set SEC=%%c
)
if "!HOUR:~0,1!"==" " set HOUR=0!HOUR:~1!
set TIMESTAMP=%DATE:~6,4%-%DATE:~3,2%-%DATE:~0,2%_!HOUR!!MIN!!SEC!
set BACKUP_NAME=backup_!TIMESTAMP!
set CONTAINER_BACKUP_PATH=/tmp/!BACKUP_NAME!.sql
set DATABASE_BACKUP_FILE=%BACKUP_DIR%\!BACKUP_NAME!.sql

:: === BACKUP-VERZEICHNIS ERSTELLEN ===
if not exist "%BACKUP_DIR%" (
    mkdir "%BACKUP_DIR%"
    echo Backup-Verzeichnis erstellt: %BACKUP_DIR%
)

echo ===============================================
echo   Starte Backup um: !TIMESTAMP!
echo ===============================================

:: === BACKUP IM CONTAINER ERSTELLEN ===
echo Führe Datenbank-Backup im Container aus...
docker exec %DATABASE_CONTAINER_NAME% pg_dump -U %POSTGRES_USER% -d %POSTGRES_DB% -f !CONTAINER_BACKUP_PATH!
if errorlevel 1 (
    echo Fehler beim Erstellen des Datenbank-Backups im Container!
    exit /b 1
)

:: === BACKUP AUF DEN HOST KOPIEREN ===
docker cp %DATABASE_CONTAINER_NAME%:!CONTAINER_BACKUP_PATH! "!DATABASE_BACKUP_FILE!"
if errorlevel 1 (
    echo Fehler beim Kopieren des Backups auf den Host!
    exit /b 1
)

echo Datenbank-Backup gespeichert: !DATABASE_BACKUP_FILE!
echo.
echo Backup abgeschlossen!
exit /b 0