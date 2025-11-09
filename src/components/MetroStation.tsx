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
            <rect
              rx={6}
              ry={6}
              x={-4}
              y={-22}
              width={name.length * 7.5}
              height={24}
              fill="white"
              stroke="#374151"
              opacity={0.95}
            />
            <text
              x={2}
              y={-6}
              fontSize={12}
              fontFamily="ui-sans-serif, system-ui"
              fill="#111827"
            >
              {name}
            </text>
          </g>
        )}
      <title>{`${name}\nLat: ${lat.toFixed(6)}\nLon: ${lon.toFixed(6)}`}</title>
    </g>
  );
};
