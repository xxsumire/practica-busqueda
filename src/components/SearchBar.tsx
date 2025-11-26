import { useEffect, useState } from 'react';
import '../styles/SearchBar.css';
import InputCustom from './ui/InputCustom';
import Result from './ui/Result';
import { useStationsContext } from './contexts/StationsContext/StationsContext';
import { useApiContext } from './contexts/ApiContext/ApiContext';
import { convertStationName } from '../common/functions';
import DateTimeLabel from './ui/DateTimeLabel.tsx';
import dayjs, { Dayjs } from 'dayjs';

import { Route as RouteIcon } from '@mui/icons-material';
import { Card, CardHeader, CardContent, Stack, Button, Dialog, DialogTitle, DialogContent, DialogActions, Checkbox, FormControlLabel } from '@mui/material';

export default function SearchBar() {

  const { status, lastResponse, get } = useApiContext() 
  const { data, setSalida, setLlegada } = useStationsContext();
  const [openErrorDialog, setOpenErrorDialog] = useState(false);
  const [fechaHora, setFechaHora] = useState<Dayjs | null>(dayjs());
  const[lluvia, setLluvia] = useState(false);

  const handleClick = async () => {
    const salida = convertStationName(data.salida)
    const llegada = convertStationName(data.llegada)
    const fecha = fechaHora ?? dayjs();
    const diaViaje = fecha.toISOString();

    const params = new URLSearchParams({
      estacion_origen: salida,
      estacion_destino: llegada,
      dia_viaje: diaViaje,
      lluvia: String(lluvia),
    });

    // const query = `estacion_origen=${data.salida}&estacion_destino=${data.llegada}`
    // const dataFromServer = await get(`/find-path/?${query}`);
    
    const dataFromServer = await get(`/find-path/?${params.toString()}`);
    
    if (dataFromServer === null) {
      setOpenErrorDialog(true);
    }
  }

  const handleClose = () => {
    setOpenErrorDialog(false);
  }

  useEffect(() => {
      console.log(lastResponse)
  }, [status])

  return (
    <div className='sb-container'>
      <Card sx={{ marginLeft: '3%', marginRight: '3%', padding: '1%' }}>
        <CardHeader
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
            {/* Hora y día de salida */}
            <DateTimeLabel
              onChange={setFechaHora}
            />
            {/* Seleccionar lluvia */}
            <FormControlLabel
              className='form-control-box'
              control={
                        <Checkbox
                          checked={lluvia}
                          onChange={(e) => setLluvia(e.target.checked)}
                        />
                      }
              label='Lluvia'
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

      {/* Container del resultado */}
      <div className='resultado-container'>
        {status == 0 && (
          <Result
            time={lastResponse.costo_total_minutos}
            distancia={lastResponse?.distancia_total_km}
            lineas={lastResponse.lineas_utilizadas}
            transbordos={lastResponse.numero_transbordos}
            origen={lastResponse.estaciones[0]}
          />
        )}
      </div>

      <Dialog
        open={openErrorDialog}
        onClose={handleClose}
      >
        <DialogTitle>
          Estaciones no encontradas
        </DialogTitle>
        <DialogContent>
          No se encontró una ruta entre las estaciones seleccionadas
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}