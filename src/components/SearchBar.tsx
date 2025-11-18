import React from 'react'

import "../styles/SearchBar.css"
import InputCustom from './ui/InputCustom'
import HomeIcon from '@mui/icons-material/Home';
import PlaceIcon from '@mui/icons-material/Place';
import ButtonCustom from './ui/ButtonCustom';
import { useStationsContext } from './contexts/StationsContext/StationsContext';
import { useApiContext } from './contexts/ApiContext/ApiContext';

export default function SearchBar() {

    const { get } = useApiContext() 
    const { data, setSalida, setLlegada } = useStationsContext();

    const handleClick = async () => {
        data.salida = data.salida.toLowerCase().replace(/ /g, '_')
        data.llegada = data.llegada.toLowerCase().replace(/ /g, '_')

        const query = `estacion_origen=${data.salida}&estacion_destino=${data.llegada}`
        const dataFromServer = await get(`/find-path/?${query}`);
        
        console.log(`Salida: ${data.salida}\nLlegada: ${data.llegada}`)
        alert(`Salida: ${data.salida}\nLlegada: ${data.llegada}\n${dataFromServer}`)
    }

    return (
        <div className='sb-container center'>
            <div className='inner'>
                <InputCustom 
                    label={<>
                        <HomeIcon className='icons home-icon-color' />
                        Estación de salida
                    </>} 
                    onChange={setSalida}
                />
                <InputCustom 
                    label={<>
                        <PlaceIcon className='icons place-icon-color' />
                        Estación de llegada
                    </>} 
                    onChange={setLlegada}
                />
            </div>
            <div className='inner center'>
                <ButtonCustom text='Busca' onClick={handleClick} />
            </div>
        </div>
    )
}

