import { type GeoProjection } from "d3-geo";

interface MetroConnectionProps {
  from: { lat: number; lon: number };
  to: { lat: number; lon: number };
  projection: GeoProjection;
}

export function MetroConnection({ from, to, projection }: MetroConnectionProps) {
  const [x1, y1] = projection([from.lon, from.lat]) ?? [0, 0];
  const [x2, y2] = projection([to.lon, to.lat]) ?? [0, 0];

  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke="#e63838ff"
      strokeWidth={3}
      strokeLinecap="round"
    />
  );
}
