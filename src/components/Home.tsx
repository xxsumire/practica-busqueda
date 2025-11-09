import { useEffect, useMemo, useState } from "react";
import { geoMercator, type GeoProjection } from "d3-geo";
// import { MetroStation } from "./MetroStation";
// import { MetroConnection } from "./MetroConnection";
import { csv } from 'd3-fetch';

export default function Home() {
  const [stations, setStations] = useState<{ name: string; lat: number; lon: number; line: string[] }[]>([]);
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
        line: d.linea.split(",").map(l => l.trim()),
      }));
      setStations(parsed);
    });
  }, []);

  // Asigna un color a las distintas líneas del metro
  const lineColors: Record<string, string> = {
    "1": "#F04E98",
    "2": "#005EB8",
    "3": "#AF9800",
    "4": "#6BBBAE",
    "5": "#FFD100",
    "6": "#DA291C",
    "7": "#E87722",
    "8": "#009A44",
    "9": "#512F2E",
    "A": "#981D97",
    "B": "#B1B3B3",
    "12": "#B0A32A",
  };


  return (
    <div className="flex flex-col items-center">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height="auto"
        className="rounded-xl shadow-lg bg-white"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {stations.map((s) => {
          const coords = projection([s.lon, s.lat]);
          if (!coords) return null;
          
          if (s.line.length > 1) {
            return (
              <circle
                key={s.name}
                cx={coords[0]}
                cy={coords[1]}
                r={4}
                fill={'#fafafaff'}
                stroke='#000000'
                strokeWidth={2}
              />
            );
          }

          const color = lineColors[s.line[0]] || "#999";
          return (
            <circle
              key={s.name}
              cx={coords[0]}
              cy={coords[1]}
              r={4}
              fill={color}
            />
          );
        })}
        {/* <rect width={width} height={height} fill="#f5f5f5" />
        {stations.map((s) => (
          <MetroStation key={s.name} {...s} projection={projection} />
        ))}

        <MetroConnection
          from={stations[1]}
          to={stations[2]}
          projection={projection}
        />

        {stations.map((s) => (
          <MetroStation key={s.name} {...s} projection={projection} />
        ))} */}
      </svg>

      <div className="text-sm mt-2 bg-white/80 rounded-lg px-3 py-1 shadow">
        {mouseLatLon
          ? `Cursor → Lat: ${mouseLatLon.lat.toFixed(6)} · Lon: ${mouseLatLon.lon.toFixed(6)}`
          : "Mueve el mouse sobre el mapa"}
      </div>
    </div>
  );
}
