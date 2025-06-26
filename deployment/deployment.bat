@echo off
title XRBT-Main
setlocal enabledelayedexpansion

:: === KONFIGURATION ===
set DOCKER_DESKTOP_PATH="C:\Program Files\Docker\Docker\Docker Desktop.exe"
set PROJECT_ROOT=%~dp0\..\
set DOCKER_FOLDER=%PROJECT_ROOT%docker
set COMPOSE_FILE=compose.app.yaml
set TARGET_URL=http://localhost:80
set BACKUP_SCRIPT=%PROJECT_ROOT%\deployment\backup.bat

echo =========================================
echo   XRBT Projekt-Deployment Initialisiert
echo =========================================
echo.

:: Docker Desktop starten
if exist %DOCKER_DESKTOP_PATH% (
    echo Starte Docker Desktop...
    start "" %DOCKER_DESKTOP_PATH%
) else (
    echo Docker Desktop nicht gefunden unter: %DOCKER_DESKTOP_PATH%
    pause
    exit /b 1
)
echo.

:: Auf Docker Engine warten
echo Warte auf Docker Engine...
:wait_docker
docker info >nul 2>&1
if errorlevel 1 (
    timeout /t 3 >nul
    goto wait_docker
)
echo Docker Engine bereit!
echo.

:: In docker-Verzeichnis wechseln
cd /d "%DOCKER_FOLDER%" || (
    echo Fehler: Verzeichnis %DOCKER_FOLDER% nicht gefunden!
    pause
    exit /b 1
)

:: Docker Compose starten
echo Starte Docker Compose...
docker compose -f %COMPOSE_FILE% up -d --build || (
    echo Fehler bei Docker Compose!
    pause
    exit /b 1
)
echo Docker Compose läuft!
echo.

:: Auto-Backup alle 60 Minuten starten
start "AutoBackup" powershell -Command "while ($true) { Start-Sleep -Seconds 3600; Start-Process -FilePath '%BACKUP_SCRIPT%' -Wait }"
echo AutoBackup gestartet...
echo.

:: Browser öffnen
start chrome --new-window "%TARGET_URL%"
echo Anwendung im Browser geöffnet.

:: Terminal offen lassen
echo.
echo Schließen Sie dieses Fenster, um Deployment zu beenden.
pause >nul