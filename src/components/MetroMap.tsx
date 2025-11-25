import { useEffect, useMemo, useState } from 'react';
import { geoMercator, type GeoProjection } from 'd3-geo';
import { csv } from 'd3-fetch';
import { HighlightedPath } from './HighlightedPathProps';
import { MetroStation } from './MetroStation';
import { useApiContext } from './contexts/ApiContext/ApiContext';
import { convertStationName } from '../common/functions';

export default function Home() {

  const { status, lastResponse } = useApiContext()
  const [stations, setStations] = useState<{ name: string; lat: number; lon: number; line: string[]; connections: string[] }[]>([]);
  const [path, setPath] = useState<string[]>([]);
  
  const width = 800;
  const height = 700;
  const center = { lat: 19.432607, lon: -99.133208 };

  const projection: GeoProjection = useMemo(() => {
    return geoMercator()
      .center([center.lon, center.lat])
      .scale(120000)
      .translate([width / 2, height / 2]);
  }, [center.lat, center.lon, width, height]);

  const [mouseLatLon, setMouseLatLon] = useState<{ lat: number; lon: number } | null>(null);

  const handleMouseMove = (evt: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    const svg = evt.currentTarget;
    const pt = svg.createSVGPoint();
    pt.x = evt.clientX;
    pt.y = evt.clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return;
    const cursor = pt.matrixTransform(ctm.inverse());
    if (projection.invert) {
      const inverted = projection.invert([cursor.x, cursor.y]);
      if (inverted) {
        const [lon, lat] = inverted;
        setMouseLatLon({ lat, lon });
      }
    }
  };

  const handleMouseLeave = () => setMouseLatLon(null);

  // Extrae la información de las estaciones del metro
  useEffect(() => {
    csv('../../public/estaciones_coords.csv').then((data) => {
      const parsed = data.map((d) => ({
        name: d.estacion,
        lat: +d.lat,
        lon: +d.lng,
        line: d.linea.split(',').map(l => l.trim()),
        connections: d.conexiones ? d.conexiones.split(',').map(c => c.trim()) : [],
      }));
      setStations(parsed);
    });
  }, []);

  const lineColors: Record<string, string> = {
    '1': '#F04E98',
    '2': '#005EB8',
    '3': '#AF9800',
    '4': '#6BBBAE',
    '5': '#FFD100',
    '6': '#DA291C',
    '7': '#E87722',
    '8': '#009A44',
    '9': '#512F2E',
    'A': '#981D97',
    'B': '#B1B3B3',
    '12': '#B0A32A',
  };

  useEffect(() => {
    console.log(lastResponse)
    setPath(lastResponse.estaciones)
  }, [lastResponse]);

  return (
    <div className='flex flex-col items-center'>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width='100%'
        height='auto'
        className='rounded-xl shadow-lg bg-white'
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Dibujo de las conexiones */}
        {stations.flatMap((s) => 
          s.connections.map((targetName) => {
            const target = stations.find(t => t.name === targetName);
            if (!target) return null;

            const coords = projection([s.lon, s.lat]);
            if (!coords) return null;

            const targetCoords = projection([target.lon, target.lat]);
            if (!targetCoords) return null;
            const [x2, y2] = targetCoords;

            // const lineColor: string = lineColors[target.line[0]]

            return (
              <line
                key={`${s.name}-${target.name}`}
                x1={coords[0]}
                y1={coords[1]}
                x2={x2}
                y2={y2}
                stroke='#9ca3af'
                // stroke={lineColor}
                strokeWidth={2}
                opacity={path !== null ? 0.3 : 0.7}
              />
            );
          })
        )}

        {status === 0 && (
          <HighlightedPath 
            // path={path} 
            // stations={stations} 
            // projection={projection} 
            path={path} 
            stations={stations} 
            projection={projection} 
          />
        )}

        {/* Dibujo de las estaciones */}
        {stations.map((s) => {
          const color = s.line.length > 1 
            ? '#fafafaff' 
            : lineColors[s.line[0]] || '#999';

          const stroke = s.line.length > 1 
            ? '#000' 
            : lineColors[s.line[0]];

          const check: string | undefined = path.find((p) => convertStationName(s.name) === p);

          return (
            <MetroStation
              key={s.name}
              name={s.name}
              lat={s.lat}
              lon={s.lon}
              projection={projection}
              color={color}
              stroke={stroke}
              opacity={path.length !== 0 && !check ? 0.5 : 1}
            />
          );
        })}
      </svg>

      <div className='text-sm mt-2 bg-white/80 rounded-lg px-3 py-1 shadow'>
        {mouseLatLon
          ? `Cursor → Lat: ${mouseLatLon.lat.toFixed(6)} · Lon: ${mouseLatLon.lon.toFixed(6)}`
          : 'Mueve el mouse sobre el mapa'}
      </div>
    </div>
  );
}
