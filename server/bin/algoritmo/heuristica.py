# Heurística (h)

"""Función heurística para A* - estima el tiempo restante hasta el objetivo.

La heurística usa la distancia en línea recta (distancia euclidiana o haversine)
dividida por la velocidad estimada, retornando el tiempo en segundos.
"""

import math
from typing import Tuple


def calcular_distancia_haversine(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calcula la distancia en kilómetros entre dos coordenadas usando la fórmula de Haversine.
    
    Args:
        lat1: Latitud del punto 1 en grados
        lon1: Longitud del punto 1 en grados
        lat2: Latitud del punto 2 en grados
        lon2: Longitud del punto 2 en grados
    
    Returns:
        Distancia en kilómetros
    """
    # Radio de la Tierra en kilómetros
    R = 6371.0
    
    # Convertir grados a radianes
    lat1_rad = math.radians(lat1)
    lon1_rad = math.radians(lon1)
    lat2_rad = math.radians(lat2)
    lon2_rad = math.radians(lon2)
    
    # Diferencias
    dlat = lat2_rad - lat1_rad
    dlon = lon2_rad - lon1_rad
    
    # Fórmula de Haversine
    a = math.sin(dlat / 2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon / 2)**2
    c = 2 * math.asin(math.sqrt(a))
    
    distancia_km = R * c
    return distancia_km


def heuristica(coord_actual: Tuple[float, float], 
               coord_objetivo: Tuple[float, float], 
               velocidad_kmh: float) -> float:
    """Calcula la heurística h(n) - tiempo estimado en segundos desde el nodo actual al objetivo.
    
    La heurística es admisible (nunca sobreestima) porque usa la distancia en línea recta,
    que siempre es menor o igual a cualquier ruta real.
    
    Args:
        coord_actual: Tupla (latitud, longitud) de la posición actual
        coord_objetivo: Tupla (latitud, longitud) del objetivo
        velocidad_kmh: Velocidad estimada en km/h para el cálculo
    
    Returns:
        Tiempo estimado en segundos para llegar al objetivo
    
    Example:
        >>> h = heuristica((19.36, -99.00), (19.43, -99.13), 40)
        >>> print(f"Tiempo estimado: {h:.2f} segundos")
    """
    lat1, lon1 = coord_actual
    lat2, lon2 = coord_objetivo
    
    # Calcular distancia en línea recta en kilómetros
    distancia_km = calcular_distancia_haversine(lat1, lon1, lat2, lon2)
    
    # Convertir velocidad a km/s
    velocidad_kms = velocidad_kmh / 3600.0
    
    # Calcular tiempo en segundos
    tiempo_segundos = distancia_km / velocidad_kms
    
    return tiempo_segundos
