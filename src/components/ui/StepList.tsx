import {
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip
} from "@mui/material";

import {
  ArrowForward as ArrowForwardIcon
} from "@mui/icons-material";

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

export default function StepsList({ pasos }: { pasos?: Paso[] }) {
  if (!pasos || pasos.length === 0) return null;

  return (
    <List sx={{ width: "100%", background: "white", borderRadius: 2, p: 1 }}>
      {pasos.map((p, i) => (
        <div key={i}>
          <ListItem alignItems="flex-start">
            <ListItemText
              primary={
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Chip 
                    className={`line-item linea-B`}
                    sx={{ fontWeight: 700 }} 
                  />
                  <ArrowForwardIcon fontSize="small" />
                  {p.nombre_origen} → {p.nombre_destino}
                </div>
              }
              secondary={
                <>
                  <div>Distancia: {p.distancia_km} km</div>
                  <div>Tiempo: {(p.costo_segundos / 60).toFixed(1)} min</div>
                  {p.es_transbordo && (
                    <div style={{ fontWeight: "700", color: "orange" }}>
                      ⚠ Transbordo
                    </div>
                  )}
                </>
              }
            />
          </ListItem>

          {i < pasos.length - 1 && <Divider />}
        </div>
      ))}
    </List>
  );
}
