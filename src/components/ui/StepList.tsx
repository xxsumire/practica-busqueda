import { useState } from 'react';
import '../../styles/SearchBar.css';
import {
  List,
  ListItemText,
  Divider,
  Stack,
  ListItemButton,
  Collapse
} from '@mui/material';

import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';

type Paso = {
  estacion_origen: string;
  nombre_origen: string;
  estacion_destino: string;
  nombre_destino: string;
  linea: string;
  es_transbordo: boolean;
  distancia_km: number;
  costo_segundos: number;
};

type Segment = {
  anchor: string;
  line: string;
  isTransbordo: boolean;
  children: string[];
  totalDistance: number;
  totalTime: number;
}

export default function StepsList({ pasos }: { pasos?: Paso[] }) {
  const [open, setOpen] = useState<Record<number,boolean>>({});

  const normalizeLinea = (value: string) => {
    if (/^[0-9]+$/.test(value)) {
      return value.replace(/^0+/, '') || '0';
    }
    return value;
  };

  if (!pasos || pasos.length === 0) return null;

  const segments: Segment[] = [];
  let current: Segment | null = null;

  pasos.forEach((station, index) => {
    const normalizeLine = normalizeLinea(station.linea);
    const stepDistance = station.distancia_km;
    const stepTime = station.costo_segundos / 60;

    if (index === 0) {
      current = {
        anchor: station.nombre_origen,
        line: normalizeLine,
        isTransbordo: false,
        children: [station.nombre_destino],
        totalDistance: stepDistance,
        totalTime: stepTime,
      };
      return;
    }

    if (station.es_transbordo) {
      if (current) {
        segments.push(current);
      }

      current = {
        anchor: station.nombre_origen,
        line: normalizeLine,
        isTransbordo: true,
        children: [station.nombre_destino],
        totalDistance: stepDistance,
        totalTime: stepTime,
      };
    } else {
      if (current) {
        current.children.push(station.nombre_destino);
        current.totalDistance += stepDistance;
        current.totalTime += stepTime;
      }
    }
  });

  if (current) {
    segments.push(current);
  }
  
  const finalStation = pasos[pasos.length - 1].nombre_destino;
  const finalLine = normalizeLinea(pasos[pasos.length - 1].linea);

  if (segments.length > 0) {
    const lastSegment = segments[segments.length - 1];
    const lastChildren = lastSegment.children[lastSegment.children.length - 1];
    if (lastChildren === finalStation) {
      lastSegment.children = lastSegment.children.slice(0, -1);
    }
  }

  const toggle = (index: number) => {
    setOpen((prev) => ({ ...prev, [index]: !prev[index] }));
  }

  return (
    <List sx={{ width: '100%', background: 'white', borderRadius: 2, p: 1 }}>
      {segments.map((segment, index) => (
        <div key={index}>
          {/* Lista de estaciones principales (origen, destino y transbordos) */}
          <ListItemButton onClick={() => toggle(index)}>
            <Stack
              direction='row'
              alignItems='center'
              justifyContent='space-between'
              sx={{ width: '100%' }}
            >
              <Stack direction='column' sx={{ flexGrow: 1 }}>
                <Stack direction='row' alignItems='center' spacing={1}>
                  <div className={`step-line-item linea-${segment.line}`}>
                    {segment.line}
                  </div>
                  <span>
                    {segment.anchor}{' '}
                    {segment.isTransbordo && (
                      <span style={{ color: 'orange', fontWeight: 600 }}>
                        - Transbordo
                      </span>
                    )}
                  </span>
                </Stack>
                <span style={{ fontSize: '0.85rem', color: '#555', marginLeft: '32px' }}>
                  {segment.totalDistance.toFixed(2)} km · {segment.totalTime.toFixed(1)} min
                </span>
              </Stack>

              {segment.children.length > 0 && (
                open[index] ? <ExpandMoreIcon /> : <ExpandLessIcon />
              )}
            </Stack>
          </ListItemButton>

          {/* Lista de estaciones hijas */}
          <Collapse in={open[index]} timeout='auto' unmountOnExit>
            <List component='div' disablePadding>
              {segment.children.map((child, i) => (
                <ListItemButton
                  key={`${child}-${i}`}
                  sx={{ pl: 6 }}
                >
                  <Stack direction='row' alignItems='center' spacing={1} sx={{ width: '100%' }}>
                    <div className={`step-line-vertical linea-${segment.line}`} />
                    <ListItemText primary={child} />
                  </Stack>
                </ListItemButton>
              ))}
            </List>
          </Collapse>

          <Divider />
        </div>
      ))}

      {/* Estación destino */}
      <ListItemButton sx={{ mt: 1 }}>
        <Stack direction='row' alignItems='center' spacing={1}>
          <div className={`step-line-item linea-${finalLine}`}>
            {finalLine}
          </div>
          <ListItemText primary={finalStation} />
        </Stack>
      </ListItemButton>
    </List>
  );
}