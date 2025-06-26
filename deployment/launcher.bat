@echo off
echo Starte Haupt-Deployment...
start "XRBT-Main" cmd /c "%~dp0deployment.bat"

echo Starte Watcher zur Überwachung des Terminal-Fensters...
start "" powershell -WindowStyle Hidden -Command ^
    "& { while (Get-Process -Name cmd -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowTitle -eq 'XRBT-Main' }) { Start-Sleep -Seconds 3 }; Start-Process -FilePath 'powershell' -ArgumentList '-NoProfile -ExecutionPolicy Bypass -File \"%~dp0watcher.ps1\"' }"

exit