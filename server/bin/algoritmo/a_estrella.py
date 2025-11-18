"""Implementación del algoritmo A* para búsqueda de rutas en el Metro.

Este módulo implementa el algoritmo de búsqueda A* adaptado para encontrar
la ruta óptima entre estaciones del metro considerando tiempo de viaje,
transbordos y afluencia de pasajeros.
"""

from typing import Dict, List, Optional, Tuple, Set
import heapq
from models.estacion_completa import EstacionCompleta, LineaEnum
from models.resultado_ruta import ResultadoRuta, PasoRuta
from bin.algoritmo.heuristica import heuristica
from bin.algoritmo.costo_real import costo_real
from bin.algoritmo.costo_total import costo_total
from datetime import datetime


class NodoAEstrella:
    """Nodo para el algoritmo A* que representa un estado en la búsqueda.
    
    Attributes:
        estacion: Nombre de la estación
        linea_actual: Línea en la que se encuentra
        g: Costo acumulado desde el inicio (g(n))
        h: Heurística estimada hasta el objetivo (h(n))
        f: Costo total f(n) = g(n) + h(n)
        padre: Nodo padre en el camino
        distancia_acumulada: Distancia total acumulada en km
    """
    def __init__(self, estacion: str, linea_actual: LineaEnum, g: float, h: float, 
                 padre: Optional['NodoAEstrella'] = None, distancia_acumulada: float = 0.0):
        self.estacion = estacion
        self.linea_actual = linea_actual
        self.g = g
        self.h = h
        self.f = costo_total(g, h)
        self.padre = padre
        self.distancia_acumulada = distancia_acumulada
    
    def __lt__(self, otro: 'NodoAEstrella') -> bool:
        """Comparación para el heap (menor f tiene prioridad)."""
        return self.f < otro.f
    
    def __eq__(self, otro: object) -> bool:
        """Igualdad basada en estación y línea."""
        if not isinstance(otro, NodoAEstrella):
            return False
        return self.estacion == otro.estacion and self.linea_actual == otro.linea_actual
    
    def __hash__(self) -> int:
        """Hash para usar en sets y dicts."""
        return hash((self.estacion, self.linea_actual))


def reconstruir_ruta(nodo_final: NodoAEstrella, 
                     estaciones_dict: Dict[str, EstacionCompleta]) -> ResultadoRuta:
    """Reconstruye la ruta desde el nodo final siguiendo los padres.
    
    Args:
        nodo_final: Nodo objetivo alcanzado
        estaciones_dict: Diccionario de todas las estaciones
    
    Returns:
        ResultadoRuta con toda la información de la ruta
    """
    # Reconstruir camino hacia atrás
    camino: List[NodoAEstrella] = []
    nodo_actual = nodo_final
    
    while nodo_actual is not None:
        camino.append(nodo_actual)
        nodo_actual = nodo_actual.padre
    
    camino.reverse()
    
    # Construir resultado
    resultado = ResultadoRuta()
    resultado.exito = True
    resultado.mensaje = "Ruta encontrada exitosamente"
    resultado.estaciones = [nodo.estacion for nodo in camino]
    resultado.costo_total_segundos = nodo_final.g
    resultado.distancia_total_km = nodo_final.distancia_acumulada
    
    # Construir pasos detallados
    lineas_usadas: Set[LineaEnum] = set()
    transbordos = 0
    
    for i in range(len(camino) - 1):
        nodo_origen = camino[i]
        nodo_destino = camino[i + 1]
        
        # Obtener estaciones
        est_origen = estaciones_dict[nodo_origen.estacion]
        est_destino = estaciones_dict[nodo_destino.estacion]
        
        # Buscar conexión
        conexion = None
        for conn in est_origen.conexiones:
            if conn.estacion == nodo_destino.estacion and conn.linea == nodo_destino.linea_actual:
                conexion = conn
                break
        
        if conexion:
            # Calcular costo de este paso
            costo_paso = nodo_destino.g - nodo_origen.g
            
            # Detectar transbordo
            es_transbordo = nodo_origen.linea_actual != nodo_destino.linea_actual
            if es_transbordo:
                transbordos += 1
            
            lineas_usadas.add(nodo_destino.linea_actual)
            
            paso = PasoRuta(
                estacion_origen=nodo_origen.estacion,
                estacion_destino=nodo_destino.estacion,
                linea=nodo_destino.linea_actual,
                distancia_km=conexion.distancia,
                costo_segundos=costo_paso,
                es_transbordo=es_transbordo
            )
            resultado.pasos.append(paso)
    
    resultado.numero_transbordos = transbordos
    resultado.lineas_utilizadas = list(lineas_usadas)
    
    return resultado


def a_estrella(
        estacion_origen: str,
        estacion_destino: str,
        estaciones_dict: Dict[str, EstacionCompleta],
        dia_viaje: datetime,
        afluencia_max: int,
        velocidad_metro_kmh: float,
        debug: bool = False
    ) -> ResultadoRuta:
    """Implementación del algoritmo A* para encontrar la ruta óptima.
    
    Args:
        estacion_origen: Nombre de la estación de inicio
        estacion_destino: Nombre de la estación objetivo
        estaciones_dict: Diccionario con todas las estaciones del sistema
        dia_viaje: Fecha del viaje
        afluencia_max: Afluencia máxima para normalizar costos
        velocidad_metro_kmh: Velocidad del metro en km/h
    
    Returns:
        ResultadoRuta con la ruta óptima o mensaje de error
    """
    # Validar entrada
    if estacion_origen not in estaciones_dict:
        return ResultadoRuta(
            exito=False,
            mensaje=f"Estación de origen '{estacion_origen}' no encontrada"
        )
    
    if estacion_destino not in estaciones_dict:
        return ResultadoRuta(
            exito=False,
            mensaje=f"Estación de destino '{estacion_destino}' no encontrada"
        )
    
    if estacion_origen == estacion_destino:
        return ResultadoRuta(
            exito=True,
            mensaje="Origen y destino son la misma estación",
            estaciones=[estacion_origen],
            costo_total_segundos=0.0
        )
    
    # Obtener estaciones
    est_origen = estaciones_dict[estacion_origen]
    est_destino = estaciones_dict[estacion_destino]
    
    # Obtener coordenadas del destino (usar la primera ubicación disponible)
    if not est_destino.ubicacion:
        return ResultadoRuta(
            exito=False,
            mensaje=f"Estación destino '{estacion_destino}' no tiene ubicación definida"
        )
    
    coord_destino = (est_destino.ubicacion[0].latitud, est_destino.ubicacion[0].longitud)
    
    # Inicializar estructuras de datos
    abiertos: List[NodoAEstrella] = []  # Cola de prioridad (heap)
    cerrados: Set[Tuple[str, LineaEnum]] = set()  # Estados ya explorados
    
    # Crear nodos iniciales (uno por cada línea de la estación origen)
    for linea in est_origen.lineas:
        # Obtener coordenadas de la estación origen en esta línea
        coord_origen = None
        for ubic in est_origen.ubicacion:
            if ubic.linea == linea:
                coord_origen = (ubic.latitud, ubic.longitud)
                break
        
        if coord_origen:
            h_inicial = heuristica(coord_origen, coord_destino, velocidad_metro_kmh)
            nodo_inicial = NodoAEstrella(estacion_origen, linea, g=0.0, h=h_inicial)
            heapq.heappush(abiertos, nodo_inicial)
    
    # Algoritmo A*
    while abiertos:
        # Obtener nodo con menor f
        nodo_actual = heapq.heappop(abiertos)
        
        # Verificar si llegamos al destino
        if nodo_actual.estacion == estacion_destino:
            return reconstruir_ruta(nodo_actual, estaciones_dict)

        # Marcar como explorado
        estado_actual = (nodo_actual.estacion, nodo_actual.linea_actual)
        if estado_actual in cerrados:
            continue
        cerrados.add(estado_actual)

        # Obtener estación actual
        est_actual = estaciones_dict[nodo_actual.estacion]
        
        if debug:
            print(f"\n[DEBUG] Explorando: {nodo_actual.estacion} (linea {nodo_actual.linea_actual.value})")
            print(f"        g={nodo_actual.g:.1f}, h={nodo_actual.h:.1f}, f={nodo_actual.f:.1f}")
            print(f"        Conexiones disponibles: {len(est_actual.conexiones)}")
        
        # Expandir vecinos (estaciones conectadas)
        for conexion in est_actual.conexiones:
            estacion_vecina = conexion.estacion
            linea_conexion = conexion.linea
            
            if debug:
                print(f"          -> {estacion_vecina} (linea {linea_conexion.value}, dist {conexion.distancia}km)")            # Verificar que la estación vecina existe
            if estacion_vecina not in estaciones_dict:
                if debug:
                    print(f"            X Estacion '{estacion_vecina}' no esta en el diccionario")
                continue

            est_vecina = estaciones_dict[estacion_vecina]

            # Calcular costo real de moverse a este vecino
            costo_movimiento = costo_real(
                est_actual, est_vecina, linea_conexion, velocidad_metro_kmh,
                afluencia_max, dia_viaje
            )

            if costo_movimiento is None:
                continue

            # Calcular g del vecino
            g_vecino = nodo_actual.g + costo_movimiento
            distancia_vecino = nodo_actual.distancia_acumulada + conexion.distancia
            
            # Verificar si ya fue explorado
            estado_vecino = (estacion_vecina, linea_conexion)
            if estado_vecino in cerrados:
                continue
            
            # Calcular heurística del vecino
            coord_vecina = None
            for ubic in est_vecina.ubicacion:
                if ubic.linea == linea_conexion:
                    coord_vecina = (ubic.latitud, ubic.longitud)
                    break
            
            if coord_vecina is None:
                # Usar la primera ubicación disponible
                if est_vecina.ubicacion:
                    coord_vecina = (est_vecina.ubicacion[0].latitud, est_vecina.ubicacion[0].longitud)
                else:
                    continue
            
            h_vecino = heuristica(coord_vecina, coord_destino, velocidad_metro_kmh)
            
            # Crear nodo vecino y agregarlo a abiertos
            nodo_vecino = NodoAEstrella(
                estacion_vecina, linea_conexion, g_vecino, h_vecino,
                padre=nodo_actual, distancia_acumulada=distancia_vecino
            )
            heapq.heappush(abiertos, nodo_vecino)

    # No se encontró ruta
    return ResultadoRuta(
        exito=False,
        mensaje=f"No se encontró ruta entre '{estacion_origen}' y '{estacion_destino}'"
    )
