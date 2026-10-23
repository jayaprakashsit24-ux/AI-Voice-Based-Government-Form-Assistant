@echo off
title VoiceGov Assist - Backend Server (FastAPI)
cd /d "%~dp0\backend"
echo ========================================================
echo Starting VoiceGov Assist Backend on http://127.0.0.1:8000
echo ========================================================
py -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
pause
