import { useEffect } from 'react'
import '../styles/SearchBar.css'
import InputCustom from './ui/InputCustom'
import { Home as HomeIcon, Place as PlaceIcon, Route as RouteIcon } from '@mui/icons-material';
import ButtonCustom from './ui/ButtonCustom';
import { useStationsContext } from './contexts/StationsContext/StationsContext';
import { useApiContext } from './contexts/ApiContext/ApiContext';
import { useNotification } from './contexts/NotificationContext/NotificationContext';
import Result from './ui/Result';
import { convertStationName } from '../common/functions';
import { Card, CardHeader, CardContent, Typography } from '@mui/material';

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
      <Card sx={{ marginLeft: '3%', marginRight: '3%' }}>
        <CardHeader
          className='header-search-box'
          title='Ingresa los datos'
          avatar={
            <RouteIcon sx={{ color: 'orange' }} />
          }
        />
        <CardContent>
          <Typography>hola</Typography>
        </CardContent>
      </Card>
      <div className='inner'>
        <div className=''>
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
        <div className='center'>
            <ButtonCustom text='Busca' onClick={handleClick} />
        </div>
      </div>
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

