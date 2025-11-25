# Script de instalación y ejecución para Windows
# Práctica Búsqueda - Sistema de Rutas de Metro

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Iniciando instalación del proyecto" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Verificar si Node.js está instalado
Write-Host "Verificando Node.js..." -ForegroundColor Yellow
if (Get-Command node -ErrorAction SilentlyContinue) {
    $nodeVersion = node --version
    Write-Host "✓ Node.js encontrado: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "✗ Node.js no está instalado. Por favor instala Node.js desde https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Verificar si Python está instalado
Write-Host "Verificando Python..." -ForegroundColor Yellow
if (Get-Command python -ErrorAction SilentlyContinue) {
    $pythonVersion = python --version
    Write-Host "✓ Python encontrado: $pythonVersion" -ForegroundColor Green
} else {
    Write-Host "✗ Python no está instalado. Por favor instala Python desde https://www.python.org/" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Configurando entorno virtual Python" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Crear entorno virtual si no existe
if (-Not (Test-Path "venv")) {
    Write-Host "Creando entorno virtual..." -ForegroundColor Yellow
    python -m venv venv
    Write-Host "✓ Entorno virtual creado" -ForegroundColor Green
} else {
    Write-Host "✓ Entorno virtual ya existe" -ForegroundColor Green
}

# Activar entorno virtual
Write-Host "Activando entorno virtual..." -ForegroundColor Yellow
& .\venv\Scripts\Activate.ps1

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Instalando dependencias Python" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Instalar dependencias de Python
Write-Host "Instalando paquetes de requirements.txt..." -ForegroundColor Yellow
pip install -r server/bin/requirements.txt

Write-Host "Instalando FastAPI y Uvicorn..." -ForegroundColor Yellow
pip install fastapi uvicorn

Write-Host "✓ Dependencias de Python instaladas" -ForegroundColor Green

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Instalando dependencias Node.js" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Instalar dependencias de Node
Write-Host "Instalando paquetes de npm..." -ForegroundColor Yellow
npm install
Write-Host "✓ Dependencias de Node.js instaladas" -ForegroundColor Green

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Instalación completada" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Preguntar si desea ejecutar el proyecto
$ejecutar = Read-Host "¿Deseas ejecutar el proyecto ahora? (S/N)"

if ($ejecutar -eq "S" -or $ejecutar -eq "s") {
    Write-Host ""
    Write-Host "=====================================" -ForegroundColor Cyan
    Write-Host "Ejecutando el proyecto" -ForegroundColor Cyan
    Write-Host "=====================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "El backend estará en: http://localhost:8000" -ForegroundColor Yellow
    Write-Host "El frontend estará en: http://localhost:5173" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Presiona Ctrl+C para detener los servidores" -ForegroundColor Yellow
    Write-Host ""
    
    # Ejecutar backend y frontend en paralelo
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; .\venv\Scripts\Activate.ps1; npm run server"
    Start-Sleep -Seconds 3
    npm run dev
} else {
    Write-Host ""
    Write-Host "Para ejecutar el proyecto más tarde, usa:" -ForegroundColor Yellow
    Write-Host "  Terminal 1: .\venv\Scripts\Activate.ps1 ; npm run server" -ForegroundColor White
    Write-Host "  Terminal 2: npm run dev" -ForegroundColor White
    Write-Host ""
    Write-Host "O ejecuta este script nuevamente." -ForegroundColor Yellow
}
