import '../../styles/SearchBar.css'
import  { AccessTime as AccessTimeIcon,
          Subway as SubwayIcon
        } from '@mui/icons-material';
import { Card, CardHeader, CardContent, Stack, Table,
  TableBody, TableCell, TableContainer, TableRow, Paper

} from '@mui/material';

interface ResultInterface {
  title?: string
  time?: number,
  distancia?: number
  lineas?: string[]
  transbordos?: number
  origen?: string
}

export default function Result({
  time,
  distancia,
  lineas,
  transbordos,
  origen,
}: ResultInterface) {

  console.log(time)

  return (
    <div className='resultado-container'>
      <Card sx={{ width: '100%' }}>
        <CardHeader
          title='Mejor resultado encontrado'
          avatar={
            <SubwayIcon sx={{color: 'orange'}}/>
          }
        />
        <CardContent>
          <div className='result-box-stations'>
            {origen}
          </div>
          <Stack direction={{ xs: 'column', sm: 'row'}}>
            <TableContainer component={Paper} variant='outlined'>
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
                      Distancia total
                    </TableCell>
                    <TableCell align='right'>
                      {distancia !== undefined ? `${distancia.toFixed(0)} km` : '—'}
                    </TableCell>
                  </TableRow>
                  {/* Fila para número de transbordos */}
                  <TableRow>
                    <TableCell component='th' scope='row'>
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

          <div>
            {lineas?.map((e, index) => (
              <>
                <div 
                  key={index}
                  className={`line-item linea-${Number(e)}`}
                >
                  {e}
                </div>
                {index < lineas.length - 1 && (
                  <div>
                    {">"}
                  </div>
                )}
              </>
            ))}
          </div>
        </CardContent>
      </Card>

    {/* <div className='left-align'>
      <div className='title'>{title}</div>
      <div className='resultado-container-inner space-between'>
        <div className='center'>
          {lineas?.map((e, index) => (
            <>
              <div 
                key={index}
                className={`line-item linea-${Number(e)}`}
              >
                {e}
              </div>
              {index < lineas.length - 1 && (
                <div>
                  {"\>"}
                </div>
              )}
            </>
          ))}
        </div>
        <div className='x-center'>
          <div className='time'>{time?.toFixed(0)} min</div>
          <div className='distancia'>{distancia?.toFixed(0)} Km</div>
        </div>
      </div>
    </div> */}
    </div>
  )
}
