Start-Sleep -Seconds 2
Write-Host "XRBT Watcher: Terminal wurde geschlossen. Starte Backup & Shutdown..."

$backupScript = Join-Path $PSScriptRoot 'backup.bat'
$composeFile = "compose.app.yaml"
$dockerFolder = Join-Path $PSScriptRoot "..\docker"

# === AutoBackup Prozess beenden ===
Write-Host "Beende AutoBackup-Prozess..."
Get-Process -Name "powershell" -ErrorAction SilentlyContinue |
    Where-Object { $_.MainWindowTitle -eq "AutoBackup" } |
    ForEach-Object { Stop-Process -Id $_.Id -Force }

# === Backup ausführen ===
& $backupScript

# === Docker Compose stoppen ===
Push-Location $dockerFolder
docker compose -f $composeFile down
Pop-Location

# === Docker Desktop beenden ===
Stop-Process -Name "Docker Desktop" -Force -ErrorAction SilentlyContinue

Write-Host "XRBT Watcher: Shutdown abgeschlossen."