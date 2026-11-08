@echo off
cd /d "%~dp0"
set "PATH=C:\Program Files\nodejs;%PATH%"

where node >nul 2>&1
if errorlevel 1 (
  echo Node.js bulunamadi. https://nodejs.org adresinden LTS kur, sonra bu dosyayi tekrar calistir.
  pause
  exit /b 1
)

echo Klasor: %CD%
echo CMS proxy baslatiliyor ^(port 8081^)...
echo Bu pencereyi kapatma. Site icin ayri pencerede python -m http.server 4173 calissin.
echo Admin: http://localhost:4173/admin
echo.

npx --yes decap-server
pause
