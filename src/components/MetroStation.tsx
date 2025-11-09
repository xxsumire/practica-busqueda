import { useState } from 'react';
import type { GeoProjection } from "d3-geo";

interface MetroStationProps {
  name: string;
  lat: number;
  lon: number;
  projection: GeoProjection;
  color?: string;
}

export const MetroStation: React.FC<MetroStationProps> = ({
  name,
  lat,
  lon,
  projection,
  color = "#ef4444",
}) => {
  const [x, y] = projection([lon, lat]) ?? [0, 0];
  const [hover, setHover] = useState(false);

  return (
    <g
      onMouseEnter = {() => setHover(true)}
      onMouseLeave = {() => setHover(false)}
    >
      <circle cx={x} cy={y} r={6} fill={color} opacity={0.9} />
      <circle cx={x} cy={y} r={6} fill="none" stroke="#111827" strokeWidth={1} />
        
        {hover && (
          <g transform={`translate(${x + 10}, ${y - 10})`}>
              <text>{name}</text>
          </g>
        )}
      <title>{`${name}\nLat: ${lat.toFixed(6)}\nLon: ${lon.toFixed(6)}`}</title>
    </g>
  );
};
