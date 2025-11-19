import { useState } from 'react';
import { createPortal } from 'react-dom';
import type { GeoProjection } from 'd3-geo';
// import { Chip } from '@mui/material';

interface MetroStationProps {
  name: string;
  lat: number;
  lon: number;
  projection: GeoProjection;
  opacity: number;
  color?: string;
  stroke?: string;
}

export const MetroStation: React.FC<MetroStationProps> = ({
  name,
  lat,
  lon,
  projection,
  color = '#ef4444',
  stroke = '#ef4444',
  opacity = 1
}) => {
  const [x, y] = projection([lon, lat]) ?? [0, 0];
  const [hover, setHover] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (evt: React.MouseEvent<SVGCircleElement, MouseEvent>) => {
    setMousePos({ x: evt.clientX + 10, y: evt.clientY - 10 });
  };

  return (
    <>
      <g
        onMouseEnter = {() => setHover(true)}
        onMouseLeave = {() => setHover(false)}
        onMouseMove={handleMouseMove}
        opacity={opacity}
      >
        <circle cx={x} cy={y} r={3} fill={color} />
        <circle cx={x} cy={y} r={4} fill='none' stroke={stroke} strokeWidth={1} />    
      </g>

      {hover && (
        createPortal(
          <div
            style={{
              position: 'fixed',
              left: mousePos.x,
              top: mousePos.y,
              background: 'white',
              border: '1px solid #374151',
              borderRadius: '6px',
              padding: '4px 8px',
              fontSize: '12px',
              fontFamily: 'ui-sans-serif, system-ui',
              color: '#111827',
              pointerEvents: 'none',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
              whiteSpace: 'nowrap',
            }}
          >
            {/* <Chip label='prueba_name Filled'/> */}
            {name}
          </div>,
        document.body
      ))}
    </>
  );
};
