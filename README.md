# Práctica Búsqueda - Sistema de Rutas de Metro

## Requisitos Previos

- Node.js (v16 o superior)
- Python (v3.8 o superior)
- pip (gestor de paquetes de Python)

## 🚀 Inicio Rápido (Recomendado)

Usa los scripts automatizados para instalar y ejecutar el proyecto con un solo comando:

### Windows (PowerShell):
```powershell
.\cicd\setup-and-run-windows.ps1
```

### Mac/Linux:
```bash
chmod +x cicd/setup-and-run-unix.sh
./cicd/setup-and-run-unix.sh
```

Los scripts automáticamente:
- ✅ Verifican requisitos previos
- ✅ Crean y activan el entorno virtual
- ✅ Instalan todas las dependencias
- ✅ Ejecutan el proyecto

**Ver más detalles en:** [`cicd/README.md`](cicd/README.md)

---

## Instalación Manual

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd practica-busqueda
```

### 2. Configurar el Backend (Python)

#### Crear y activar entorno virtual

**En Windows (PowerShell):**
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

**En Windows (CMD):**
```cmd
python -m venv venv
venv\Scripts\activate.bat
```

**En Linux/Mac:**
```bash
python -m venv venv
source venv/bin/activate
```

#### Instalar dependencias de Python

```bash
pip install -r server/bin/requirements.txt
pip install fastapi uvicorn
```

### 3. Configurar el Frontend (Node.js)

#### Instalar dependencias de Node

```bash
npm install
```

## Ejecución Manual del Proyecto

### Opción 1: Ejecutar Backend y Frontend por separado

#### Terminal 1 - Backend (con entorno virtual activado):
```bash
npm run server
```

El servidor estará disponible en: `http://localhost:8000`

#### Terminal 2 - Frontend:
```bash
npm run dev
```

El frontend estará disponible en: `http://localhost:5173`

### Opción 2: Scripts disponibles

- `npm run dev` - Inicia el servidor de desarrollo frontend
- `npm run server` - Inicia el servidor backend
- `npm run build` - Compila el proyecto para producción
- `npm run preview` - Previsualiza la build de producción
- `npm run lint` - Ejecuta el linter

## Estructura del Proyecto

- `/server` - Backend en Python con FastAPI
- `/src` - Frontend en React con TypeScript
- `/public` - Archivos estáticos (datos de estaciones)

## Notas Importantes

- Asegúrate de tener el entorno virtual activado antes de ejecutar el servidor backend
- El backend debe estar ejecutándose antes de usar el frontend
- Si cambias de terminal, recuerda activar nuevamente el entorno virtual con el comando correspondiente a tu sistema operativo
