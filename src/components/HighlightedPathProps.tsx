import type { GeoProjection } from 'd3-geo';

interface HighlightedPathProps {
  path: string[];
  stations: { name: string; lat: number; lon: number }[];
  projection: GeoProjection;
}

export function HighlightedPath({ path, stations, projection }: HighlightedPathProps) {
  if (!path || path.length < 2) return null;

  return (
    <>
      {path.slice(0, -1).map((name, i) => {
        const from = stations.find((s) => s.name === name);
        const to = stations.find((s) => s.name === path[i + 1]);
        if (!from || !to) return null;

        const fromCoords = projection([from.lon, from.lat]);
        const toCoords = projection([to.lon, to.lat]);
        if (!fromCoords || !toCoords) return null;

        return (
          <line
            key={`${from.name}-${to.name}`}
            x1={fromCoords[0]}
            y1={fromCoords[1]}
            x2={toCoords[0]}
            y2={toCoords[1]}
            stroke='red'
            strokeWidth={4}
            opacity={0.9}
          />
        );
      })}
    </>
  );
}
