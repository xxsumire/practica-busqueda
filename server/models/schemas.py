from pydantic import BaseModel, Field

from typing import List, Optional
from models.resultado_ruta import ResultadoRuta, PasoRuta
from models.estacion_completa import LineaEnum

class ResultadoRutaParsed(BaseModel):
    estaciones: List[str] = Field(default_factory=list)
    pasos: List[PasoRuta] = Field(default_factory=list)
    costo_total_minutos: float = 0.0
    distancia_total_km: float = 0.0
    lineas_utilizadas: List[LineaEnum] = Field(default_factory=list)
    numero_transbordos: int = 0

class ServerResponse(BaseModel):
    code: int
    data: Optional[dict] = None # ResultadoRutaParsed
    error: Optional[str] = None
