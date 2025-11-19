export interface RequestSettingsInterface {
    method: string
    headers?: { [key: string]: string }
    body?: string | null
}

export interface DataFromServer {
    estaciones: string[]            // estaciones
    pasos: string[]

    costo_total_minutos: number     // tiempo 
    distancia_total_km: number      // distancia en metros 
    n_estaciones?: number           // numero estaciones 
    lineas_utilizadas?: string[]    // lineas utilizadas

    numero_transbordos: number
}

export interface ResponseFromServer {
    code: number
    data: DataFromServer
    error?: string
}

export interface RequestObjectToServer {
    salida: string
    llegada: string
}

export interface ApiContextInterface {
    get: (route: string) => Promise<ResponseFromServer | string | null>
    post: (route: string, body: RequestObjectToServer) => Promise<ResponseFromServer | string | null>
    lastResponse: DataFromServer
    lastError: string | null
    status: number
    url: string
}