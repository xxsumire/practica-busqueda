# Scripts de CI/CD

Esta carpeta contiene scripts automatizados para facilitar la instalación y ejecución del proyecto.

## Scripts Disponibles

### Windows (PowerShell)

**Archivo:** `setup-and-run-windows.ps1`

**Uso:**
```powershell
.\cicd\setup-and-run-windows.ps1
```

**Nota:** Si tienes problemas de permisos de ejecución, ejecuta primero:
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

### Mac/Linux (Bash)

**Archivo:** `setup-and-run-unix.sh`

**Uso:**
```bash
# Dar permisos de ejecución (solo la primera vez)
chmod +x cicd/setup-and-run-unix.sh

# Ejecutar el script
./cicd/setup-and-run-unix.sh
```

## Qué Hace el Script

1. **Verifica requisitos previos:**
   - Node.js instalado
   - Python instalado

2. **Configura el entorno Python:**
   - Crea un entorno virtual (si no existe)
   - Activa el entorno virtual
   - Instala las dependencias de `requirements.txt`
   - Instala FastAPI y Uvicorn

3. **Configura el entorno Node.js:**
   - Instala todas las dependencias de `package.json`

4. **Ejecuta el proyecto (opcional):**
   - Abre una terminal para el backend (servidor Python)
   - Inicia el frontend (servidor de desarrollo Vite)

## Ejecución Manual

Si prefieres ejecutar el proyecto manualmente después de la instalación:

### Windows:
```powershell
# Terminal 1 - Backend
.\venv\Scripts\Activate.ps1
npm run server

# Terminal 2 - Frontend
npm run dev
```

### Mac/Linux:
```bash
# Terminal 1 - Backend
source venv/bin/activate
npm run server

# Terminal 2 - Frontend
npm run dev
```

## Solución de Problemas

### Windows - Error de política de ejecución
Si recibes un error sobre políticas de ejecución:
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

### Mac/Linux - Permiso denegado
Si recibes "Permission denied":
```bash
chmod +x cicd/setup-and-run-unix.sh
```

### Python no encontrado en Mac/Linux
El script busca tanto `python3` como `python`. Si ninguno está disponible, instala Python desde:
- Mac: `brew install python3`
- Ubuntu/Debian: `sudo apt install python3 python3-venv python3-pip`

## URLs del Proyecto

- **Backend API:** http://localhost:8000
- **Frontend:** http://localhost:5173
- **API Docs:** http://localhost:8000/docs
