#!/bin/bash

# Script de instalación y ejecución para Mac/Linux
# Práctica Búsqueda - Sistema de Rutas de Metro

# Colores para output
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${CYAN}=====================================${NC}"
echo -e "${CYAN}Iniciando instalación del proyecto${NC}"
echo -e "${CYAN}=====================================${NC}"
echo ""

# Verificar si Node.js está instalado
echo -e "${YELLOW}Verificando Node.js...${NC}"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓ Node.js encontrado: $NODE_VERSION${NC}"
else
    echo -e "${RED}✗ Node.js no está instalado. Por favor instala Node.js desde https://nodejs.org/${NC}"
    exit 1
fi

# Verificar si Python está instalado
echo -e "${YELLOW}Verificando Python...${NC}"
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    echo -e "${GREEN}✓ Python encontrado: $PYTHON_VERSION${NC}"
    PYTHON_CMD="python3"
elif command -v python &> /dev/null; then
    PYTHON_VERSION=$(python --version)
    echo -e "${GREEN}✓ Python encontrado: $PYTHON_VERSION${NC}"
    PYTHON_CMD="python"
else
    echo -e "${RED}✗ Python no está instalado. Por favor instala Python desde https://www.python.org/${NC}"
    exit 1
fi

echo ""
echo -e "${CYAN}=====================================${NC}"
echo -e "${CYAN}Configurando entorno virtual Python${NC}"
echo -e "${CYAN}=====================================${NC}"
echo ""

# Crear entorno virtual si no existe
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}Creando entorno virtual...${NC}"
    $PYTHON_CMD -m venv venv
    echo -e "${GREEN}✓ Entorno virtual creado${NC}"
else
    echo -e "${GREEN}✓ Entorno virtual ya existe${NC}"
fi

# Activar entorno virtual
echo -e "${YELLOW}Activando entorno virtual...${NC}"
source venv/bin/activate

echo ""
echo -e "${CYAN}=====================================${NC}"
echo -e "${CYAN}Instalando dependencias Python${NC}"
echo -e "${CYAN}=====================================${NC}"
echo ""

# Instalar dependencias de Python
echo -e "${YELLOW}Instalando paquetes de requirements.txt...${NC}"
pip install -r server/bin/requirements.txt

echo -e "${YELLOW}Instalando FastAPI y Uvicorn...${NC}"
pip install fastapi uvicorn

echo -e "${GREEN}✓ Dependencias de Python instaladas${NC}"

echo ""
echo -e "${CYAN}=====================================${NC}"
echo -e "${CYAN}Instalando dependencias Node.js${NC}"
echo -e "${CYAN}=====================================${NC}"
echo ""

# Instalar dependencias de Node
echo -e "${YELLOW}Instalando paquetes de npm...${NC}"
npm install
echo -e "${GREEN}✓ Dependencias de Node.js instaladas${NC}"

echo ""
echo -e "${CYAN}=====================================${NC}"
echo -e "${GREEN}Instalación completada${NC}"
echo -e "${CYAN}=====================================${NC}"
echo ""

# Preguntar si desea ejecutar el proyecto
read -p "¿Deseas ejecutar el proyecto ahora? (S/N): " ejecutar

if [[ $ejecutar == "S" || $ejecutar == "s" ]]; then
    echo ""
    echo -e "${CYAN}=====================================${NC}"
    echo -e "${CYAN}Ejecutando el proyecto${NC}"
    echo -e "${CYAN}=====================================${NC}"
    echo ""
    echo -e "${YELLOW}El backend estará en: http://localhost:8000${NC}"
    echo -e "${YELLOW}El frontend estará en: http://localhost:5173${NC}"
    echo ""
    echo -e "${YELLOW}Presiona Ctrl+C para detener los servidores${NC}"
    echo ""
    
    # Ejecutar backend en segundo plano
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        osascript -e 'tell app "Terminal" to do script "cd '"$PWD"' && source venv/bin/activate && npm run server"'
    else
        # Linux
        if command -v gnome-terminal &> /dev/null; then
            gnome-terminal -- bash -c "cd $PWD && source venv/bin/activate && npm run server; exec bash"
        elif command -v xterm &> /dev/null; then
            xterm -e "cd $PWD && source venv/bin/activate && npm run server" &
        else
            echo -e "${YELLOW}No se pudo abrir una terminal nueva para el backend.${NC}"
            echo -e "${YELLOW}Por favor, abre una nueva terminal y ejecuta:${NC}"
            echo -e "  cd $PWD"
            echo -e "  source venv/bin/activate"
            echo -e "  npm run server"
            echo ""
            read -p "Presiona Enter cuando el backend esté ejecutándose..."
        fi
    fi
    
    sleep 3
    npm run dev
else
    echo ""
    echo -e "${YELLOW}Para ejecutar el proyecto más tarde, usa:${NC}"
    echo -e "  Terminal 1: source venv/bin/activate && npm run server"
    echo -e "  Terminal 2: npm run dev"
    echo ""
    echo -e "${YELLOW}O ejecuta este script nuevamente: ./cicd/setup-and-run-unix.sh${NC}"
fi
