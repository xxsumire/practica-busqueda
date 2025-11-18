import React, { createContext, useContext, useState, type ReactNode } from "react";
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

    const [lastResponse, setLastResponse] = useState<DataFromServer | string | null>(null);
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
        // const res = await fetch(url_test, settings)

        const data: ResponseFromServer = await res.json()
        setLastResponse(data.data)
        console.log(data)

        if (data.code == 0) {
            return data;
        } else {
            return null;
        }
    }

    return (
        <ApiContext.Provider value={{
            get: (r: string) => getFromServer(r, 'GET'), 
            post: (r: string) => getFromServer(r, 'POST'), 
            lastResponse, 
            url
        }} >
            {children}
        </ApiContext.Provider>
    )

} 