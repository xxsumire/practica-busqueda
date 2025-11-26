import '../../styles/SearchBar.css'
import StationBox from './StationBox';
import PathBox from './PathBox';
import StepsList from './StepList';
import  { AccessTime as AccessTimeIcon,
          Subway as SubwayIcon,
          Navigation as NavigationIcon,
          TransferWithinAStation as TransferWithinAStationIcon,
        } from '@mui/icons-material';
import {  Card, CardHeader, CardContent, Stack, Table,
          TableBody, TableCell, TableContainer, TableRow, Paper
       } from '@mui/material';

type Paso = {
  estacion_origen: string
  nombre_origen: string
  estacion_destino: string
  nombre_destino: string
  linea: string
  es_transbordo: boolean
  distancia_km: number
  costo_segundos: number
}

type LineaUsada = {
  linea: string
  orden: number
}

interface ResultInterface {
  title?: string
  time?: number,
  distancia?: number
  lineas?: LineaUsada[]
  transbordos?: number
  pasos?: Paso[]
}

export default function Result({
  time,
  distancia,
  lineas,
  transbordos,
  pasos,
}: ResultInterface) {

  const normalizeLinea = (value: string) => {
    if (/^[0-9]+$/.test(value)) {
      return value.replace(/^0+/, '') || '0';
    }
    return value;
  };
  
  // Ordenar las líneas por su atributo orden
  const lineasOrdenadas = lineas ? [...lineas].sort((a, b) => a.orden - b.orden) : [];

  const origen = pasos && pasos.length > 0 ? pasos[0].nombre_origen : "—";
  const origenId = pasos && pasos.length > 0 ? pasos[0].estacion_origen : null;

  const lineasOrigen = origenId && pasos
  ? Array.from(
      new Set(
        pasos
          .filter(
            (p) =>
              p.estacion_origen === origenId ||
              p.estacion_destino === origenId
          )
          .map((p) => normalizeLinea(p.linea))
      )
    )
  : [];

  const destino = pasos && pasos.length > 0 ? pasos[pasos.length - 1].nombre_destino : "—";
  const destinoId = pasos && pasos.length > 0 ? pasos[pasos.length - 1].estacion_destino : null;

  const lineasDestino = destinoId && pasos
  ? Array.from(
      new Set(
        pasos
          .filter(
            (p) =>
              p.estacion_origen === destinoId ||
              p.estacion_destino === destinoId
          )
          .map((p) => normalizeLinea(p.linea))
      )
    )
  : [];
  
  return (
    <div className='resultado-container'>
      <Card sx={{ width: '100%', padding: '1%' }}>
        <CardHeader
          title='Mejor resultado encontrado'
          avatar={
            <SubwayIcon sx={{color: 'orange'}}/>
          }
        />
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row'}} sx={{ width: '100%', display: 'flex', justifyContent: 'space-between'}}>
            <div className='result-box-stations'>
              <StationBox
                title='Origen'
                station={origen}
                lines={lineasOrigen}
              />
              <StationBox
                title='Destino'
                station={destino}
                lines={lineasDestino}
              />
            </div>
            <Stack direction={{ xs: 'column', sm: 'row'}} 
              sx={{ 
                width: '100%'
              }}
            >
              <TableContainer 
                component={Paper} 
                variant='outlined'
                sx={{ height: 'fit-content' }}
                >
                <Table size='small'>
                  <TableBody>
                    {/* Fila para tiempo estimado */}
                    <TableRow>
                      <TableCell component='th' scope='row' sx={{display: 'flex', alignItems: 'center'}}>
                        <AccessTimeIcon sx={{ fontSize: 20, verticalAlign: 'middle', mr: 1 }} />
                        Tiempo estimado
                      </TableCell>
                      <TableCell align='right'>
                        {time !== undefined ? `${time.toFixed(0)} minutos` : '—'}
                      </TableCell>
                    </TableRow>
                    {/* Fila para distancia total */}
                    <TableRow>
                      <TableCell component='th' scope='row'>
                        <NavigationIcon sx={{ fontSize: 20, verticalAlign: 'middle', mr: 1 }} />
                        Distancia total
                      </TableCell>
                      <TableCell align='right'>
                        {distancia !== undefined ? `${distancia.toFixed(0)} km` : '—'}
                      </TableCell>
                    </TableRow>
                    {/* Fila para número de transbordos */}
                    <TableRow>
                      <TableCell component='th' scope='row'>
                        <TransferWithinAStationIcon sx={{ fontSize: 20, verticalAlign: 'middle', mr: 1 }} />
                        Número de transbordos
                      </TableCell>
                      <TableCell align='right'>
                        {transbordos !== undefined ? transbordos : '—'}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Stack>
          </Stack>
        </CardContent>
        {/* Muestra las líneas que recorre */}
        <PathBox
          lineas={lineasOrdenadas}
        />
        <StepsList
          pasos={pasos}
        />
      </Card>
    </div>
  )
}
