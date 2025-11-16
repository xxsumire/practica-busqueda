import React, { 
    useEffect, 
    useState, 
    type ReactNode 
} from 'react'

import { csv } from 'd3-fetch'
import { lineColors } from '../../common/constants'

import "../../styles/InputCustom.css"
import "../../styles/linesColor.scss"

interface InputCustomInterface {
    type?: "default" | "primary" |"tiny",
    label: ReactNode
    onChange?: (d: string) => void
}

type StationType = {
    name: string
    line: string[]
}   

const chooseType = (
    type: "default" | "primary" | "tiny", 
    handler: (e: string) => void
) => {
    switch (type) {
        case "default": 
            handler("input-default")
            break;
        case "primary":
            handler("input-primary")
            break;
        case "tiny":
            handler("input-tiny")
            break;
    }
}

const parseCsv = (
    // csvFileName: string, 
    handler: (items: StationType[]) => void) => {

    csv('../../public/estaciones_coords.csv').then((data) => {
        const parsed = data.map((d) => ({
            name: d.estacion,
            line: d.linea.split(',').map(l => l.trim()),
        }));
        handler(parsed);
    });
}

export default function InputCustom({
    type = "default",
    label,
    onChange
}: InputCustomInterface) {

    const [innerStyle, setInnerStyle] = useState<string>();
    const [stations, setStations] = useState<StationType[]>();

    const [query, setQuery] = useState<string>("")
    const [isOpen, setIsOpen] = useState<boolean>(false)

    useEffect(() => {
        chooseType(type, setInnerStyle)
        parseCsv(setStations)
    }, [])

    const filteredStations = stations?.filter(e =>
        e.name.toLowerCase().includes(
            query.toLowerCase()
        )
    );

    const styleStation = (item: StationType) => {
        return (
            <div className='center'>
                {item.name}
                {item.line.map((e, index) => (
                    <div 
                        key={index}
                        className={`line-item linea-${e}`}
                    >
                        {e}
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className='input-container'>
            <label className='label-custom'>{label}</label>
            <div className='relative'>
                <input 
                    className={innerStyle + " input-custom"}
                    type="text" 
                    value={query}
                    placeholder='Busca una estacion'
                    onFocus={() => setIsOpen(true)}
                    onChange={(e) => {
                        setQuery(e.target.value)
                        setIsOpen(true)
                    }} 
                />

                {isOpen && query && (
                    <div className='input-result-container'>
                        {filteredStations && filteredStations.length > 0 ? (
                            filteredStations.map((e, index) => {
                                return (<div
                                    key={index}
                                    onClick={() => {
                                        setQuery(e.name)
                                        setIsOpen(false)
                                        onChange?.(e.name)
                                    }}
                                    className='item'
                                >
                                    {styleStation(e)}
                                </div>)
                            })
                        ) : (
                            <div className='no-found'>
                                Ningun resultado encontrado
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
