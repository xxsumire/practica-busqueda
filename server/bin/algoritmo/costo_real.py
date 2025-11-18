# Costo real (g)

"""Función de costo real para A* - calcula el costo acumulado desde el inicio.

El costo considera:
- Distancia real entre estaciones conectadas
- Afluencia máxima en la estación (afecta el tiempo de espera/movimiento)
- Transbordos entre líneas (tiempo de caminata entre andenes)
- Velocidad del metro en la línea actual
"""

from typing import Optional
from models.estacion_completa import EstacionCompleta, LineaEnum, Conexion
from bin.algoritmo.constantes import (
    VELOCIDAD_CAMINATA_PROMEDIO,
    FACTOR_FIN_DE_SEMANA,
    FACTOR_DIA_SEMANA,
    FACTOR_HORA_PICO,
    FACTOR_NO_HORA_PICO
)
from datetime import datetime


def obtener_conexion(
    estacion_origen: EstacionCompleta, 
    estacion_destino: EstacionCompleta
) -> Optional[Conexion]:
    """Busca la conexión entre dos estaciones en una línea específica.
    
    Args:
        estacion_origen: Estación de origen
        estacion_destino: Estación de destino
    
    Returns:
        Objeto Conexion si existe, None si no hay conexión directa
    """
    for conexion in estacion_origen.conexiones:
        if conexion.estacion == estacion_destino.name:
            return conexion
    return None


def calcular_factor_afluencia(afluencia: int, afluencia_max: int, dia_viaje: datetime) -> float:
    """Calcula el factor multiplicador basado en la afluencia de la estación.
    
    A mayor afluencia, mayor el tiempo de espera y movimiento.
    
    Args:
        afluencia: Número promedio de personas en la estación
        afluencia_max: Afluencia máxima usada para normalizar
        dia_viaje: Fecha del viaje
    
    Returns:
        Factor multiplicador (1.0 = sin impacto, >1.0 = retraso por multitud)
    """
    # Normalizar afluencia: por cada 10,000 personas, agregar 10% de retraso
    # Factor mínimo de 1.0 (sin retraso) hasta ~2.0 para estaciones muy concurridas
    # Agregamos un factor por dia y hora
    factor_hora = 0
    if dia_viaje.weekday() < 5:  # Días laborables
        factor_hora = FACTOR_DIA_SEMANA
        if 7 <= dia_viaje.hour < 9 or 18 <= dia_viaje.hour < 20:
            factor_hora *= FACTOR_HORA_PICO
        else:
            factor_hora *= FACTOR_NO_HORA_PICO
        
    else:
        factor_hora = FACTOR_FIN_DE_SEMANA

    factor = 1.0 + (afluencia / afluencia_max)  * factor_hora
    return factor  # Limitar a máximo 2x


def obtener_distancia_transbordo(
    estacion: EstacionCompleta, 
    linea_origen: LineaEnum,
    linea_destino: LineaEnum
) -> float:
    """Obtiene la distancia de caminata para hacer transbordo entre líneas.
    
    Args:
        estacion: Estación donde se hace el transbordo
        linea_origen: Línea actual
        linea_destino: Línea a la que se cambia
    
    Returns:
        Distancia en kilómetros para caminar entre andenes
    """
    # Buscar en los transbordos de la estación
    for transbordo in estacion.transbordos:
        # Verificar que el transbordo involucre ambas líneas
        if linea_origen in transbordo.lineas and linea_destino in transbordo.lineas:
            return transbordo.distancia
    
    # Si no hay información específica, usar distancia por defecto (100 metros)
    return 0


def costo_real(
    estacion_origen: EstacionCompleta,
    estacion_destino: EstacionCompleta,
    linea_actual: LineaEnum,
    velocidad_metro_kmh: float,
    afluencia_max: int,
    dia_viaje: datetime
) -> Optional[float]:
    """Calcula el costo real g(n) de moverse de una estación a otra.
    
    El costo representa el tiempo en segundos considerando:
    1. Tiempo de viaje en el metro (distancia / velocidad)
    2. Factor de afluencia (multitudes enlentecen el movimiento)
    3. Tiempo de transbordo si se cambia de línea (caminata entre andenes)
    
    Args:
        estacion_origen: Estación actual
        estacion_destino: Estación siguiente
        linea_actual: Línea en la que se está viajando
        velocidad_metro_kmh: Velocidad del metro en km/h
        afluencia_max: Afluencia máxima usada para normalizar el factor de afluencia
    
    Returns:
        Tiempo en segundos para el movimiento, o None si no hay conexión directa
    """
    # 1. Verificar si hay conexión directa
    if not estacion_destino.abierta:
        return 2e10
    conexion = obtener_conexion(estacion_origen, estacion_destino)
    
    if conexion is None:
        # No hay conexión directa en esta línea
        return 2e10
    
    # 2. Calcular tiempo base de viaje (distancia / velocidad)
    distancia_km = conexion.distancia
    velocidad_kms = velocidad_metro_kmh / 3600.0  # Convertir km/h a km/s
    tiempo_viaje_segundos = distancia_km / velocidad_kms
    
    # 3. Aplicar factor de afluencia en la estación origen
    # Obtener afluencia de la línea actual
    afluencia_linea = 0
    for afluencia in estacion_origen.afluencia_promedio:
        if afluencia.linea == conexion.linea:
            afluencia_linea = afluencia.promedio
            break
    
    if afluencia_linea == 0:
        print(f"Advertencia: Afluencia no encontrada para línea {linea_actual} en estación {estacion_origen.name}")
    
    factor_afluencia = calcular_factor_afluencia(afluencia_linea, afluencia_max, dia_viaje)
    tiempo_con_afluencia = tiempo_viaje_segundos * factor_afluencia
    
    # 4. Verificar si hay transbordo (cambio de línea)
    tiempo_transbordo = 0.0
    
    # Si la estación destino tiene la línea actual, verificar si necesitamos transbordo
    # para llegar a otras líneas disponibles en destino
    # Si la conexión usa una línea diferente a la actual, hay transbordo
    if conexion.linea != linea_actual:
        # Calcular tiempo de caminata para el transbordo
        linea_destino = conexion.linea
        distancia_transbordo_km = obtener_distancia_transbordo(
            estacion_origen, linea_actual, linea_destino
        )
        velocidad_caminata_kms = VELOCIDAD_CAMINATA_PROMEDIO / 3600.0
        tiempo_transbordo = distancia_transbordo_km / velocidad_caminata_kms
    else:
        linea_destino = linea_actual
    
    # 5. Costo total = tiempo de viaje + tiempo de transbordo
    costo_total_segundos = tiempo_con_afluencia + tiempo_transbordo
    
    return costo_total_segundos
