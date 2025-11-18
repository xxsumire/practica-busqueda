# Documentación del Sistema A* para Metro CDMX / A* System Documentation for CDMX Metro

## Español

### Descripción General

Este proyecto implementa el algoritmo A* (A-Star) para encontrar rutas óptimas en el Sistema de Transporte Colectivo Metro de la Ciudad de México. El sistema considera múltiples factores para calcular la ruta más eficiente entre dos estaciones:

- Distancia real entre estaciones
- Tiempo de viaje estimado
- Afluencia de pasajeros (concurrencia)
- Transbordos entre líneas
- Día y hora del viaje (hora pico vs. no hora pico)
- Velocidad del metro

### Estructura del Proyecto

```
Proyecto_IA/
├── algoritmo/           # Implementación del algoritmo A*
│   ├── a_estrella.py   # Algoritmo principal A*
│   ├── heuristica.py   # Función heurística h(n)
│   ├── costo_real.py   # Función de costo real g(n)
│   ├── costo_total.py  # Función de costo total f(n)
│   └── constantes.py   # Constantes del sistema
├── models/              # Modelos de datos
│   ├── estacion_completa.py  # Modelo de estación
│   └── resultado_ruta.py     # Modelo de resultado
├── helpers/             # Funciones auxiliares
│   └── load_locations.py     # Carga de datos
├── data/                # Datos del metro
│   └── datos-completos.json  # Base de datos de estaciones
└── tests/               # Pruebas del sistema
    ├── test_1.py        # Prueba con líneas 6 y 7
    ├── test_2.py        # Prueba con líneas 2, 3, 6 y 7
    ├── test_3.py        # Prueba con 6 líneas
    └── test_4.py        # Prueba con todas las líneas
```

### Componentes del Algoritmo A*

#### 1. Función Heurística h(n)

**Archivo:** `algoritmo/heuristica.py`

La función heurística estima el tiempo restante desde una estación actual hasta el destino usando la distancia en línea recta (fórmula de Haversine).

**Fórmula de Haversine:**

```
a = sin²(Δlat/2) + cos(lat1) × cos(lat2) × sin²(Δlon/2)
c = 2 × asin(√a)
distancia = R × c
```

Donde:
- `R` = Radio de la Tierra (6371 km)
- `Δlat` = diferencia de latitudes en radianes
- `Δlon` = diferencia de longitudes en radianes

**Cálculo del tiempo:**

```python
tiempo_segundos = distancia_km / (velocidad_kmh / 3600)
```

**Características:**
- Es **admisible**: nunca sobreestima el costo real porque la línea recta es la distancia mínima
- Garantiza que A* encuentre la ruta óptima

#### 2. Función de Costo Real g(n)

**Archivo:** `algoritmo/costo_real.py`

Calcula el costo real de moverse de una estación a otra considerando:

**a) Tiempo de viaje base:**
```python
tiempo_viaje = distancia_km / (velocidad_kmh / 3600)
```

**b) Factor de afluencia:**

El factor de afluencia penaliza estaciones con alta concurrencia:

```python
factor_afluencia = 1.0 + (afluencia / afluencia_max) × factor_temporal
```

Donde `factor_temporal` depende del día y hora:
- **Día laboral + hora pico** (7-9 AM, 6-8 PM): `FACTOR_DIA_SEMANA × FACTOR_HORA_PICO`
- **Día laboral + no hora pico**: `FACTOR_DIA_SEMANA × FACTOR_NO_HORA_PICO`
- **Fin de semana**: `FACTOR_FIN_DE_SEMANA`

**c) Tiempo de transbordo:**

Si se cambia de línea:
```python
tiempo_transbordo = distancia_transbordo_km / (VELOCIDAD_CAMINATA_PROMEDIO / 3600)
```

**Costo total del movimiento:**
```python
costo_total = tiempo_viaje × factor_afluencia + tiempo_transbordo
```

#### 3. Función de Costo Total f(n)

**Archivo:** `algoritmo/costo_total.py`

Combina el costo real y la heurística:

```python
f(n) = g(n) + h(n)
```

Esta función determina la prioridad de exploración de cada nodo.

### Constantes del Sistema

**Archivo:** `algoritmo/constantes.py`

```python
# Velocidades (km/h)
VELOCIDAD_NORMAL_PROMEDIO = 40
VELOCIDAD_POR_LLUVIA = 20
VELOCIDAD_CAMINATA_PROMEDIO = 5

# Factores temporales
FACTOR_DIA_SEMANA = 0.3
FACTOR_FIN_DE_SEMANA = 0.1
FACTOR_HORA_PICO = 2.0
FACTOR_NO_HORA_PICO = 1.0
```

### Cómo Funciona el Algoritmo

1. **Inicialización:**
   - Crea un nodo inicial por cada línea disponible en la estación origen
   - Inicializa la lista abierta (nodos por explorar) y cerrada (nodos visitados)

2. **Bucle principal:**
   ```
   mientras lista_abierta no esté vacía:
       nodo_actual = extraer nodo con menor f(n)
       
       si nodo_actual es destino:
           reconstruir y retornar ruta
       
       marcar nodo_actual como visitado
       
       para cada vecino de nodo_actual:
           calcular g(vecino) = g(actual) + costo_real(actual, vecino)
           calcular h(vecino) = heuristica(vecino, destino)
           calcular f(vecino) = g(vecino) + h(vecino)
           
           si vecino no visitado:
               agregar vecino a lista_abierta
   ```

3. **Reconstrucción de ruta:**
   - Sigue los punteros padre desde el destino hasta el origen
   - Calcula estadísticas: transbordos, tiempo total, distancia

### Instalación y Configuración

#### Requisitos

- Python 3.8+
- Pydantic
- geopy (opcional, para cálculos de distancia)

#### Instalación de dependencias

```bash
# Activar entorno virtual (opcional pero recomendado)
python -m venv venv
.\venv\Scripts\Activate.ps1  # Windows PowerShell
# o
source venv/bin/activate  # Linux/Mac

# Instalar dependencias
pip install pydantic geopy
```

### Uso del Sistema

#### Ejemplo básico

```python
from helpers.load_locations import load_estaciones_completas
from algoritmo.a_estrella import a_estrella
from algoritmo.constantes import VELOCIDAD_NORMAL_PROMEDIO
from datetime import datetime

# 1. Cargar datos
estaciones = load_estaciones_completas("data/datos-completos.json")
estaciones_dict = {e.name: e for e in estaciones}

# 2. Calcular afluencia máxima
afluencia_max = max(
    afluencia.promedio
    for estacion in estaciones
    for afluencia in estacion.afluencia_promedio
)

# 3. Definir fecha y hora del viaje
dia_viaje = datetime(2021, 4, 3, 16, 0)  # Sábado 3 abril 2021, 4 PM

# 4. Buscar ruta
resultado = a_estrella(
    estacion_origen="tacuba",
    estacion_destino="insurgentes",
    estaciones_dict=estaciones_dict,
    dia_viaje=dia_viaje,
    afluencia_max=afluencia_max,
    velocidad_metro_kmh=VELOCIDAD_NORMAL_PROMEDIO
)

# 5. Mostrar resultado
print(resultado)
```

### Ejecución de Pruebas

El proyecto incluye 4 pruebas con diferentes configuraciones:

#### Test 1: Líneas 6 y 7
```bash
python tests/test_1.py
```
- **Origen:** Tacuba
- **Destino:** Martín Carrera
- **Líneas:** 6 y 7
- **Fecha:** Sábado 3 abril 2021, 4:00 PM

#### Test 2: Líneas 2, 3, 6 y 7
```bash
python tests/test_2.py
```
- **Origen:** Tacuba
- **Destino:** Martín Carrera
- **Líneas:** 2, 3, 6 y 7
- **Fecha:** Sábado 3 abril 2021, 4:00 PM

#### Test 3: 6 Líneas (1, 2, 3, 6, 7, 9)
```bash
python tests/test_3.py
```
- **Origen:** Observatorio
- **Destino:** Martín Carrera
- **Líneas:** 1, 2, 3, 6, 7 y 9
- **Fecha:** Lunes 12 abril 2021, 8:00 AM (hora pico)

#### Test 4: Todas las Líneas
```bash
python tests/test_4.py
```
- **Origen:** Universidad
- **Destino:** Martín Carrera
- **Líneas:** Todas (1, 2, 3, 4, 5, 6, 7, 8, 9, A, B, 12)
- **Fecha:** Lunes 12 abril 2021, 8:00 AM (hora pico)

### Interpretación de Resultados

El sistema muestra:

```
Ruta encontrada: 8 estaciones
  Tiempo total: 25.43 minutos (1525.8 segundos)
  Distancia total: 15.67 km
  Transbordos: 2
  Lineas: 07 -> 06 -> 04

  Detalle de la ruta:
    1. tacuba -> refineria (Linea 07): 2.09 min (1.30 km)
    2. refineria -> camarones (Linea 07): 1.58 min (0.95 km)
    3. camarones -> el_rosario (Linea 07): 3.21 min (1.40 km) [TRANSBORDO]
    4. el_rosario -> tezozomoc (Linea 06): 2.75 min (1.20 km)
    ...
```

**Leyenda:**
- **Tiempo total:** Duración estimada del viaje
- **Distancia total:** Kilómetros recorridos
- **Transbordos:** Número de cambios de línea
- **[TRANSBORDO]:** Indica que en ese paso se cambia de línea

### Modo Debug

Para activar el modo debug y ver el proceso de exploración:

```python
resultado = a_estrella(
    estacion_origen="tacuba",
    estacion_destino="martin_carrera",
    estaciones_dict=estaciones_dict,
    dia_viaje=dia_viaje,
    afluencia_max=afluencia_max,
    velocidad_metro_kmh=VELOCIDAD_NORMAL_PROMEDIO,
    debug=True  # Activa mensajes de debug
)
```

### Limitaciones y Consideraciones

1. **Estaciones cerradas:** El algoritmo evita estaciones marcadas como cerradas (`abierta=False`)
2. **Datos filtrados:** Si filtras estaciones por línea, las conexiones a estaciones no incluidas se ignoran
3. **Heurística:** Usa distancia en línea recta, que puede subestimar en zonas con geografía compleja
4. **Factores temporales:** Son estimaciones; el tráfico real puede variar

---

## English

### General Description

This project implements the A* (A-Star) algorithm to find optimal routes in the Mexico City Metro System (Sistema de Transporte Colectivo). The system considers multiple factors to calculate the most efficient route between two stations:

- Real distance between stations
- Estimated travel time
- Passenger flow (crowding)
- Line transfers
- Day and time of travel (peak vs. off-peak hours)
- Metro speed

### Project Structure

```
Proyecto_IA/
├── algoritmo/           # A* algorithm implementation
│   ├── a_estrella.py   # Main A* algorithm
│   ├── heuristica.py   # Heuristic function h(n)
│   ├── costo_real.py   # Real cost function g(n)
│   ├── costo_total.py  # Total cost function f(n)
│   └── constantes.py   # System constants
├── models/              # Data models
│   ├── estacion_completa.py  # Station model
│   └── resultado_ruta.py     # Result model
├── helpers/             # Helper functions
│   └── load_locations.py     # Data loading
├── data/                # Metro data
│   └── datos-completos.json  # Station database
└── tests/               # System tests
    ├── test_1.py        # Test with lines 6 and 7
    ├── test_2.py        # Test with lines 2, 3, 6, and 7
    ├── test_3.py        # Test with 6 lines
    └── test_4.py        # Test with all lines
```

### A* Algorithm Components

#### 1. Heuristic Function h(n)

**File:** `algoritmo/heuristica.py`

The heuristic function estimates the remaining time from the current station to the destination using straight-line distance (Haversine formula).

**Haversine Formula:**

```
a = sin²(Δlat/2) + cos(lat1) × cos(lat2) × sin²(Δlon/2)
c = 2 × asin(√a)
distance = R × c
```

Where:
- `R` = Earth's radius (6371 km)
- `Δlat` = difference in latitudes (radians)
- `Δlon` = difference in longitudes (radians)

**Time calculation:**

```python
time_seconds = distance_km / (speed_kmh / 3600)
```

**Features:**
- **Admissible**: never overestimates the real cost because straight-line distance is the minimum
- Guarantees A* finds the optimal route

#### 2. Real Cost Function g(n)

**File:** `algoritmo/costo_real.py`

Calculates the real cost of moving from one station to another considering:

**a) Base travel time:**
```python
travel_time = distance_km / (speed_kmh / 3600)
```

**b) Crowding factor:**

The crowding factor penalizes stations with high passenger flow:

```python
crowding_factor = 1.0 + (flow / max_flow) × temporal_factor
```

Where `temporal_factor` depends on day and time:
- **Weekday + peak hours** (7-9 AM, 6-8 PM): `WEEKDAY_FACTOR × PEAK_HOUR_FACTOR`
- **Weekday + off-peak**: `WEEKDAY_FACTOR × OFF_PEAK_FACTOR`
- **Weekend**: `WEEKEND_FACTOR`

**c) Transfer time:**

If changing lines:
```python
transfer_time = transfer_distance_km / (WALKING_SPEED / 3600)
```

**Total movement cost:**
```python
total_cost = travel_time × crowding_factor + transfer_time
```

#### 3. Total Cost Function f(n)

**File:** `algoritmo/costo_total.py`

Combines real cost and heuristic:

```python
f(n) = g(n) + h(n)
```

This function determines the exploration priority of each node.

### System Constants

**File:** `algoritmo/constantes.py`

```python
# Speeds (km/h)
VELOCIDAD_NORMAL_PROMEDIO = 40      # Normal average speed
VELOCIDAD_POR_LLUVIA = 20           # Speed during rain
VELOCIDAD_CAMINATA_PROMEDIO = 5     # Average walking speed

# Temporal factors
FACTOR_DIA_SEMANA = 0.3            # Weekday factor
FACTOR_FIN_DE_SEMANA = 0.1         # Weekend factor
FACTOR_HORA_PICO = 2.0             # Peak hour factor
FACTOR_NO_HORA_PICO = 1.0          # Off-peak factor
```

### How the Algorithm Works

1. **Initialization:**
   - Creates an initial node for each available line at the origin station
   - Initializes open list (nodes to explore) and closed list (visited nodes)

2. **Main loop:**
   ```
   while open_list is not empty:
       current_node = extract node with lowest f(n)
       
       if current_node is destination:
           reconstruct and return route
       
       mark current_node as visited
       
       for each neighbor of current_node:
           calculate g(neighbor) = g(current) + real_cost(current, neighbor)
           calculate h(neighbor) = heuristic(neighbor, destination)
           calculate f(neighbor) = g(neighbor) + h(neighbor)
           
           if neighbor not visited:
               add neighbor to open_list
   ```

3. **Route reconstruction:**
   - Follows parent pointers from destination to origin
   - Calculates statistics: transfers, total time, distance

### Installation and Setup

#### Requirements

- Python 3.8+
- Pydantic
- geopy (optional, for distance calculations)

#### Installing dependencies

```bash
# Activate virtual environment (optional but recommended)
python -m venv venv
.\venv\Scripts\Activate.ps1  # Windows PowerShell
# or
source venv/bin/activate  # Linux/Mac

# Install dependencies
pip install pydantic geopy
```

### System Usage

#### Basic example

```python
from helpers.load_locations import load_estaciones_completas
from algoritmo.a_estrella import a_estrella
from algoritmo.constantes import VELOCIDAD_NORMAL_PROMEDIO
from datetime import datetime

# 1. Load data
stations = load_estaciones_completas("data/datos-completos.json")
stations_dict = {s.name: s for s in stations}

# 2. Calculate maximum flow
max_flow = max(
    flow.promedio
    for station in stations
    for flow in station.afluencia_promedio
)

# 3. Define trip date and time
trip_date = datetime(2021, 4, 3, 16, 0)  # Saturday April 3, 2021, 4 PM

# 4. Find route
result = a_estrella(
    estacion_origen="tacuba",
    estacion_destino="insurgentes",
    estaciones_dict=stations_dict,
    dia_viaje=trip_date,
    afluencia_max=max_flow,
    velocidad_metro_kmh=VELOCIDAD_NORMAL_PROMEDIO
)

# 5. Show result
print(result)
```

### Running Tests

The project includes 4 tests with different configurations:

#### Test 1: Lines 6 and 7
```bash
python tests/test_1.py
```
- **Origin:** Tacuba
- **Destination:** Martín Carrera
- **Lines:** 6 and 7
- **Date:** Saturday April 3, 2021, 4:00 PM

#### Test 2: Lines 2, 3, 6, and 7
```bash
python tests/test_2.py
```
- **Origin:** Tacuba
- **Destination:** Martín Carrera
- **Lines:** 2, 3, 6, and 7
- **Date:** Saturday April 3, 2021, 4:00 PM

#### Test 3: 6 Lines (1, 2, 3, 6, 7, 9)
```bash
python tests/test_3.py
```
- **Origin:** Observatorio
- **Destination:** Martín Carrera
- **Lines:** 1, 2, 3, 6, 7, and 9
- **Date:** Monday April 12, 2021, 8:00 AM (peak hour)

#### Test 4: All Lines
```bash
python tests/test_4.py
```
- **Origin:** Universidad
- **Destination:** Martín Carrera
- **Lines:** All (1, 2, 3, 4, 5, 6, 7, 8, 9, A, B, 12)
- **Date:** Monday April 12, 2021, 8:00 AM (peak hour)

### Result Interpretation

The system displays:

```
Route found: 8 stations
  Total time: 25.43 minutes (1525.8 seconds)
  Total distance: 15.67 km
  Transfers: 2
  Lines: 07 -> 06 -> 04

  Route details:
    1. tacuba -> refineria (Line 07): 2.09 min (1.30 km)
    2. refineria -> camarones (Line 07): 1.58 min (0.95 km)
    3. camarones -> el_rosario (Line 07): 3.21 min (1.40 km) [TRANSFER]
    4. el_rosario -> tezozomoc (Line 06): 2.75 min (1.20 km)
    ...
```

**Legend:**
- **Total time:** Estimated trip duration
- **Total distance:** Kilometers traveled
- **Transfers:** Number of line changes
- **[TRANSFER]:** Indicates a line change at this step

### Debug Mode

To enable debug mode and see the exploration process:

```python
result = a_estrella(
    estacion_origen="tacuba",
    estacion_destino="martin_carrera",
    estaciones_dict=stations_dict,
    dia_viaje=trip_date,
    afluencia_max=max_flow,
    velocidad_metro_kmh=VELOCIDAD_NORMAL_PROMEDIO,
    debug=True  # Enable debug messages
)
```

### Limitations and Considerations

1. **Closed stations:** The algorithm avoids stations marked as closed (`abierta=False`)
2. **Filtered data:** If you filter stations by line, connections to non-included stations are ignored
3. **Heuristic:** Uses straight-line distance, which may underestimate in areas with complex geography
4. **Temporal factors:** Are estimates; actual traffic may vary

---

## Licencia / License

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

This project is open source and available under the MIT License.
