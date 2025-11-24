from fastapi import APIRouter, Depends, HTTPException, status
from models.schemas import ServerResponse, ResultadoRutaParsed
from bin.helpers.load_locations import load_estaciones_completas
from bin.algoritmo.a_estrella import a_estrella
from bin.algoritmo.constantes import VELOCIDAD_NORMAL_PROMEDIO, VELOCIDAD_POR_LLUVIA
from datetime import datetime
from config.config import Config

router = APIRouter() 

@router.get("/", response_model=ServerResponse)
def find_path(
        estacion_origen: str,
        estacion_destino: str,
        dia_viaje: datetime,
        lluvia: bool = False
    ) -> ServerResponse:
    
    estaciones = load_estaciones_completas(Config.DATOS_COMPLETOS)
    estaciones_dict = {e.name: e for e in estaciones}

    afluencia_max = max(
        afluencia.promedio
        for estacion in estaciones
        for afluencia in estacion.afluencia_promedio
    )


    resultado = a_estrella(
        estacion_origen=estacion_origen,
        estacion_destino=estacion_destino,
        estaciones_dict=estaciones_dict,
        dia_viaje=dia_viaje,
        afluencia_max=afluencia_max,
        velocidad_metro_kmh=VELOCIDAD_NORMAL_PROMEDIO if not lluvia else VELOCIDAD_POR_LLUVIA,
        # debug=True
    )

    response = ServerResponse(code=0)

    if resultado.exito: 
        response.code = 0
        response.data = ResultadoRutaParsed(
            estaciones=resultado.estaciones,
            pasos=resultado.pasos,
            costo_total_minutos=resultado.costo_total_minutos,
            distancia_total_km=resultado.distancia_total_km,
            lineas_utilizadas=resultado.lineas_utilizadas,
            numero_transbordos=resultado.numero_transbordos
        )
    else:
        response.code = 1
        response.error = resultado.mensaje

    return response
