// Vista del profesional: solo las cunas que la jefatura le asignó para el día.
import { useEffect, useState } from "react";

import Card from "@/components/ui/Card/Card";
import { getMisCunas } from "@/services/turnosService";
import type { CunaAsignada } from "@/types/turnos";
import { hoyISO } from "@/utils/fechas";

export default function MisCunasPage() {
  const [fecha, setFecha] = useState(hoyISO());
  const [cunas, setCunas] = useState<CunaAsignada[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getMisCunas(fecha)
      .then((datos) => {
        setCunas(datos);
        setError("");
      })
      .catch((err: Error) => setError(err.message));
  }, [fecha]);

  return (
    <div style={{ textAlign: "left" }}>
      <h1>Mis cunas</h1>

      <label>Fecha </label>
      <input
        type="date"
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
      />

      {error && <p style={{ color: "red" }}>{error}</p>}
      {!error && cunas.length === 0 && (
        <p>No tienes cunas asignadas para este día.</p>
      )}

      {cunas.map((cuna) => (
        <Card key={cuna.id} title={cuna.identificador}>
          <p>Paciente: {cuna.paciente_detalle?.nombre ?? "Cuna vacía"}</p>
          <p>Diagnóstico: {cuna.paciente_detalle?.diagnostico ?? "-"}</p>
          <p>
            FC: {cuna.ritmo_cardiaco ?? "-"} bpm | SpO2: {cuna.spo2 ?? "-"}% |
            Temp: {cuna.temperatura ?? "-"} °C
          </p>
        </Card>
      ))}
    </div>
  );
}
