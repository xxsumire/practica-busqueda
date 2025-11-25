import { createContext, useContext, useState, type ReactNode } from "react";
import { type StationsContextInterface, type StationsSelected } from "./TypesStationsContext"

const StationsContext = createContext<StationsContextInterface | null>(null);

export const useStationsContext = () => {
    const context = useContext(StationsContext);
    if (!context) {
        throw new Error('useStationsContext must be used within a StationsProvider');
    }
    return context;
};

export const StationsProvider = ({ children }: { children: ReactNode }) => {

    const [values, setValues] = useState<StationsSelected>({
        salida: "",
        llegada: ""
    })

    const setSalida = (s: string) => {
        setValues(prev => ({
            ...prev,
            salida: s
        }))
    }

    const setLlegada = (s: string) => {
        setValues(prev => ({
            ...prev,
            llegada: s
        }))
    }

    return (
        <StationsContext.Provider value={{ data: values, setSalida, setLlegada }} >
            {children}
        </StationsContext.Provider>
    )

} 