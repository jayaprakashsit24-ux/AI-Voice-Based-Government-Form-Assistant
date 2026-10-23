Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "Launching VoiceGov Assist (Backend + Frontend)" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

$backendScript = Join-Path $PSScriptRoot "start-backend.bat"
$frontendScript = Join-Path $PSScriptRoot "start-frontend.bat"

Start-Process cmd -ArgumentList "/k `"$backendScript`""
Start-Sleep -Seconds 2
Start-Process cmd -ArgumentList "/k `"$frontendScript`""

Write-Host "Backend running on:  http://127.0.0.1:8000" -ForegroundColor Green
Write-Host "Frontend running on: http://localhost:5173" -ForegroundColor Green
Write-Host "Opening browser..." -ForegroundColor Yellow
Start-Process "http://localhost:5173"
