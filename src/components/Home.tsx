import React, { useMemo, useState } from "react";
import { geoMercator, type GeoProjection } from "d3-geo";
import { MetroStation } from "./MetroStation";

export default function Home() {
  const width = 800;
  const height = 600;

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

  const stations = [
    { name: "Zócalo/Tenochtitlan", lat: 19.432607, lon: -99.133208 },
    { name: "Pino Suárez", lat: 19.425, lon: -99.132 },
    { name: "Insurgentes", lat: 19.4231, lon: -99.1669 },
  ];

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
        <rect width={width} height={height} fill="#f5f5f5" />
        {stations.map((s) => (
          <MetroStation key={s.name} {...s} projection={projection} />
        ))}
      </svg>

      <div className="text-sm mt-2 bg-white/80 rounded-lg px-3 py-1 shadow">
        {mouseLatLon
          ? `Cursor → Lat: ${mouseLatLon.lat.toFixed(6)} · Lon: ${mouseLatLon.lon.toFixed(6)}`
          : "Mueve el mouse sobre el mapa"}
      </div>
    </div>
  );
}
