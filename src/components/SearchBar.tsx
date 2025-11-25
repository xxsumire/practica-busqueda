import { useEffect } from 'react';
import '../styles/SearchBar.css';
import InputCustom from './ui/InputCustom';
import Result from './ui/Result';
import { useStationsContext } from './contexts/StationsContext/StationsContext';
import { useApiContext } from './contexts/ApiContext/ApiContext';
import { useNotification } from './contexts/NotificationContext/NotificationContext';
import { convertStationName } from '../common/functions';

import { Route as RouteIcon } from '@mui/icons-material';
import { Card, CardHeader, CardContent, Stack, Button } from '@mui/material';

export default function SearchBar() {

  const { showNotification, hideNotification } = useNotification()
  const { status, lastError, lastResponse, get } = useApiContext() 
  const { data, setSalida, setLlegada } = useStationsContext();

  const handleClick = async () => {
    data.salida = convertStationName(data.salida)
    data.llegada = convertStationName(data.llegada)

    const query = `estacion_origen=${data.salida}&estacion_destino=${data.llegada}`
    const dataFromServer = await get(`/find-path/?${query}`);

    if (dataFromServer === null) {
      showNotification({
        purpose: "alert",
        type: "error",
        title: "Estaciones no encontradas",
        message: lastError,
        buttons: [{
          onClick: hideNotification,
          text: "Cierra",
          type: "error"
        }]
      })
    }
  }

  useEffect(() => {
      console.log(lastResponse)
  }, [status])

  return (
    <div className='sb-container'>
      <Card sx={{ marginLeft: '3%', marginRight: '3%', padding: '1%' }}>
        <CardHeader
          className='header-search-box'
          title='Ingresa los datos'
          avatar={
            <RouteIcon sx={{ color: 'orange' }} />
          }
        />
        <CardContent>
          <Stack direction={{ xs: 'column' }}>
            {/* Estación de salida*/}
            <InputCustom 
              labelInput='Estación de salida'
              onChange={setSalida}
            />
            {/* Estación de llegada*/}
            <InputCustom 
              labelInput='Estación de llegada'
              onChange={setLlegada}
            />
            <Button 
              variant='contained'
              onClick={handleClick}
              sx={{ color: 'white', fontWeight: '800', letterSpacing: '1px' }}
              >
                Buscar
            </Button>
          </Stack>
        </CardContent>
      </Card>
      <div className='resultado-container'>
        <div className='resultado'>
          {status == 0 && (
            <Result 
              title="Resultado mejor encontrado:"
              time={lastResponse.costo_total_minutos}
              distancia={lastResponse?.distancia_total_km}
              lineas={lastResponse.lineas_utilizadas}
            />
          )}
        </div>
      </div>
    </div>
  )
}

