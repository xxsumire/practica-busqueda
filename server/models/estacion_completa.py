"""Modelo Pydantic para estaciones del metro con múltiples líneas, conexiones y afluencia.

Este modelo mapea la estructura compleja de datos-completos.json donde cada estación
puede tener múltiples líneas, ubicaciones específicas por línea, conexiones y afluencia.
"""


from typing import Dict, List
from pydantic import BaseModel, Field
from enum import Enum

class LineaEnum(str, Enum):
    """Enumeración de líneas del metro."""
    L1 = "01"
    L2 = "02"
    L3 = "03"
    L4 = "04"
    L5 = "05"
    L6 = "06"
    L7 = "07"
    L8 = "08"
    L9 = "09"
    LA = "A"
    LB = "B"
    L12 = "12"



class Ubicacion(BaseModel):
    """Coordenadas geográficas de una estación en una línea específica."""
    linea: LineaEnum
    longitud: float
    latitud: float


class Transbordo(BaseModel):
    lineas: List[LineaEnum]
    distancia: float  # en kilómetros


class Conexion(BaseModel):
    """Representa una conexión entre estaciones."""
    estacion: str
    distancia: float  # en kilómetros
    linea: LineaEnum


class Afluencia(BaseModel):
    linea: LineaEnum
    promedio: int  # afluencia promedio diaria


class EstacionCompleta(BaseModel):
    """Modelo completo de una estación del metro.
    
    Atributos:
        lineas: Lista de líneas que pasan por esta estación
        transbordos: Lista de líneas con transbordo disponible
        ubicacion: Dict mapeando línea -> coordenadas
        conexiones: Lista de conexiones con otras estaciones
        afluencia_promedio: Dict mapeando línea -> afluencia promedio
        abierta: Estado de operación de la estación
    """
    name: str
    lineas: List[LineaEnum]
    transbordos: List[Transbordo]
    ubicacion: List[Ubicacion]
    conexiones: List[Conexion]
    afluencia_promedio: List[Afluencia]
    nombre_original: str
    abierta: bool = True

    @classmethod
    def from_dict(cls, data: Dict, key: str) -> "EstacionCompleta":
        """Crea una instancia de EstacionCompleta a partir de un diccionario."""
        lineas = [LineaEnum(l) for l in data.get("lineas", [])]
        transbordos = [Transbordo(**t) for t in data.get("transbordos", [])]
        ubicaciones = []
        for key_linea, loc in data.get("ubicacion", {}).items():
            ubicaciones.append(Ubicacion(linea=LineaEnum(key_linea), **loc))
        conexiones = [Conexion(**conn) for conn in data.get("conexiones", [])]
        afluencias = []
        for key_linea, aflu in data.get("afluencia_promedio", {}).items():
            afluencias.append(Afluencia(linea=LineaEnum(key_linea), promedio=aflu))

        return cls(
            name=key,
            lineas=lineas,
            transbordos=transbordos,
            ubicacion=ubicaciones,
            conexiones=conexiones,
            afluencia_promedio=afluencias,
            abierta=data.get("abierta", True),
            nombre_original=data.get("nombre_original", "")
        )
