REM Archivo: Backend\academic_service\start.bat
REM Proposito: Implementa la logica principal del archivo start.
@echo off
cd /d %~dp0

call .\.venv\Scripts\activate

python run.py

pause