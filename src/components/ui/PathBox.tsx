import '../../styles/SearchBar.css';
import { Breadcrumbs, CardHeader } from '@mui/material';
import { 
        ArrowForward as ArrowForwardIcon,
        TurnSharpLeft as TurnSharpLeftIcon
       } from '@mui/icons-material';

interface PathInterface {
  lineas?: string[]
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
          {lineas?.map((linea, index) => {
            const normalized = normalizeLinea(String(linea));
            return (
              <div 
                key={`${linea}-${index}`}
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