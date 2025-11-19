import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { 
    type ApiContextInterface, 
    type ResponseFromServer, 
    type RequestObjectToServer,
    type DataFromServer,
    type RequestSettingsInterface
} from "./TypeApiContext"

const ApiContext = createContext<ApiContextInterface | null>(null);

export const useApiContext = () => {
    const context = useContext(ApiContext);
    if (!context) {
        throw new Error('useApiContext must be used within a ApiContextProvider');
    }
    return context;
};

export const ApiProvider = ({ children }: { children: ReactNode }) => {

    const [status, setStatus] = useState<number>(1)
    const [lastResponse, setLastResponse] = useState<DataFromServer>({
        estaciones: [],
        pasos: [],
        costo_total_minutos: 0,
        distancia_total_km: 0,
        numero_transbordos: 0
    });
    const [lastError, setLastError] = useState<string | null>(null);
    const url = "http://localhost:8000/api/v1";
    // const url_test = "http://localhost:8000/"

    const getFromServer = async (
        route: string, 
        method: string, 
        body?: RequestObjectToServer
    ): Promise<ResponseFromServer | null> => {

        let settings: RequestSettingsInterface = {
            method
        }

        if (method === 'POST') {
            settings = {
                ...settings,
                headers: { 'Content-Type:': "application/json" },
                body: JSON.stringify(body)
            }
        }
        
        const res = await fetch(url + route, settings)
        const data: ResponseFromServer = await res.json()
        setStatus(data.code)

        if (data.code == 0) {
            console.log(data?.data)
            setLastResponse(data?.data)
            setLastError(null)
            return data;
        } else {
            setLastError(data.error ?? "Generical Error")
            return null;
        }
    }

    useEffect(() => {
        return () => {
            setStatus(1);
            setLastResponse({
                estaciones: [],
                pasos: [],
                costo_total_minutos: 0,
                distancia_total_km: 0,
                numero_transbordos: 0
            });
            setLastError(null);
        };
    }, [])

    return (
        <ApiContext.Provider value={{
            get: (r: string) => getFromServer(r, 'GET'), 
            post: (r: string) => getFromServer(r, 'POST'), 
            lastResponse, 
            lastError,
            status,
            url
        }} >
            {children}
        </ApiContext.Provider>
    )

} 