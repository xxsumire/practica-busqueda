"""Modelos para representar el resultado de búsqueda de rutas con A*.

Define las estructuras de datos que representan una ruta completa con
información detallada de cada paso y costos asociados.
"""

from typing import List
from pydantic import BaseModel, Field
from models.estacion_completa import LineaEnum


class PasoRuta(BaseModel):
    """Representa un paso individual en la ruta (movimiento entre estaciones).
    
    Attributes:
        estacion_origen: Nombre de la estación de origen
        estacion_destino: Nombre de la estación de destino
        linea: Línea utilizada para este tramo
        distancia_km: Distancia en kilómetros
        costo_segundos: Tiempo en segundos para este tramo
        es_transbordo: Indica si este paso incluye un transbordo
    """
    estacion_origen: str
    nombre_origen: str
    estacion_destino: str
    nombre_destino: str
    linea: LineaEnum
    distancia_km: float
    costo_segundos: float
    es_transbordo: bool = False
    posicion_origen: int = 0

class LineasUsadas(BaseModel):
    """Representa las líneas utilizadas en la ruta."""
    linea: LineaEnum
    orden: int
    
    def __hash__(self) -> int:
        return hash((self.linea, self.orden))

class ResultadoRuta(BaseModel):
    """Resultado completo de la búsqueda de ruta con A*.
    
    Attributes:
        estaciones: Lista ordenada de nombres de estaciones en la ruta
        pasos: Lista de objetos PasoRuta con detalles de cada tramo
        costo_total_segundos: Tiempo total del recorrido en segundos
        distancia_total_km: Distancia total recorrida en kilómetros
        numero_transbordos: Cantidad de transbordos realizados
        lineas_utilizadas: Lista de líneas utilizadas en orden
        exito: Indica si se encontró una ruta válida
        mensaje: Mensaje descriptivo sobre el resultado
    """
    estaciones: List[str] = Field(default_factory=list)
    nombres_originales: List[str] = Field(default_factory=list)
    pasos: List[PasoRuta] = Field(default_factory=list)
    costo_total_segundos: float = 0.0
    distancia_total_km: float = 0.0
    numero_transbordos: int = 0
    lineas_utilizadas: List[LineasUsadas] = Field(default_factory=list)
    exito: bool = False
    mensaje: str = ""
    
    @property
    def costo_total_minutos(self) -> float:
        """Retorna el costo total en minutos."""
        return self.costo_total_segundos / 60.0
    
    @property
    def numero_estaciones(self) -> int:
        """Retorna el número total de estaciones en la ruta."""
        return len(self.estaciones)
    
    def __str__(self) -> str:
        """Representación legible de la ruta."""
        if not self.exito:
            return f"X {self.mensaje}"
        
        lineas_str = " -> ".join([l.value for l in self.lineas_utilizadas])
        resultado = [
            f"Ruta encontrada: {self.numero_estaciones} estaciones",
            f"  Tiempo total: {self.costo_total_minutos:.2f} minutos ({self.costo_total_segundos:.1f} segundos)",
            f"  Distancia total: {self.distancia_total_km:.2f} km",
            f"  Transbordos: {self.numero_transbordos}",
            f"  Lineas: {lineas_str}",
            f"\n  Detalle de la ruta:"
        ]
        
        # Mostrar cada paso con tiempo
        for i, paso in enumerate(self.pasos, 1):
            tiempo_min = paso.costo_segundos / 60.0
            transbordo_str = " [TRANSBORDO]" if paso.es_transbordo else ""
            resultado.append(
                f"    {i}. {paso.estacion_origen} -> {paso.estacion_destino} "
                f"(Linea {paso.linea.value}): {tiempo_min:.2f} min ({paso.distancia_km:.2f} km){transbordo_str}"
            )
        
        return "\n".join(resultado)
