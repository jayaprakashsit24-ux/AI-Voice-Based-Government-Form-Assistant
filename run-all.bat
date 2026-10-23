@echo off
title VoiceGov Assist - Launcher
echo ========================================================
echo Launching VoiceGov Assist (Backend + Frontend)
echo ========================================================
start "VoiceGov Backend" cmd /k "%~dp0start-backend.bat"
timeout /t 2 >nul
start "VoiceGov Frontend" cmd /k "%~dp0start-frontend.bat"
echo Services launched!
echo Backend:  http://127.0.0.1:8000
echo Frontend: http://localhost:5173
