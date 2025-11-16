export interface StationsSelected {
    salida: string,
    llegada: string
}

export interface StationsContextInterface {
    data: StationsSelected
    setSalida: (s: string) => void
    setLlegada: (s: string) => void
}