import '../../styles/SearchBar.css';
import { Breadcrumbs, CardHeader } from '@mui/material';
import { 
        ArrowForward as ArrowForwardIcon,
        TurnSharpLeft as TurnSharpLeftIcon
       } from '@mui/icons-material';

type LineaUsada = {
  linea: string
  orden: number
}

interface PathInterface {
  lineas?: LineaUsada[]
}

export default function PathBox({ lineas }:PathInterface) {
  const normalizeLinea = (value: string) => {
    if (/^[0-9]+$/.test(value)) {
      return value.replace(/^0+/, '') || '0';
    }
    return value;
  };

  return (
    <div className='lines-section-box'>
      <CardHeader
        title='Recorrido'
        avatar={
          <TurnSharpLeftIcon sx={{color: 'orange'}}/>
        }
      />
      <div className='lines-result-box'>
        <Breadcrumbs
          separator={<ArrowForwardIcon fontSize='small'/>}
        >
          {lineas?.map((lineaObj, index) => {
            const normalized = normalizeLinea(String(lineaObj.linea));
            return (
              <div 
                key={`${lineaObj.linea}-${index}`}
                className={`line-item linea-${normalized}`}
              >
                {normalized}
              </div>
            );
          })}
        </Breadcrumbs>
      </div>
    </div>
  );
}