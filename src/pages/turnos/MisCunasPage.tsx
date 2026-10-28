// Vista del profesional: solo las cunas que la jefatura le asignó para el día.
import { useEffect, useState } from 'react';

import Card from '@/components/ui/Card/Card';
import { getMisCunas } from '@/services/turnosService';
import type { CunaAsignada } from '@/types/turnos';
import { hoyISO } from '@/utils/fechas';

/**
 * Función auxiliar asíncrona para recuperar las cunas asignadas al profesional según la fecha seleccionada.
 * Extraída para mantener el cuerpo principal del componente plano y desacoplado del efecto.
 *
 * @param fecha - Cadena de texto con la fecha en formato ISO.
 * @param setCunas - Función para actualizar el estado del listado de cunas asignadas.
 * @param setError - Función para actualizar el estado de errores en caso de fallo.
 */
async function cargarCunasAsignadas(
  fecha: string,
  setCunas: (cunas: CunaAsignada[]) => void,
  setError: (error: string) => void
) {
  try {
    const datos = await getMisCunas(fecha);
    setCunas(datos);
    setError('');
  } catch (err) {
    const errorObj = err as Error;
    setError(errorObj.message);
  }
}

/**
 * Componente de página para la vista del profesional médico.
 * Permite consultar y visualizar las cunas y pacientes asignados a su turno para una fecha específica,
 * mostrando métricas clínicas y signos vitales en tiempo real.
 *
 * @returns Un elemento JSX con la vista estructurada de cunas asignadas.
 */
export default function MisCunasPage() {
  const [fecha, setFecha] = useState(hoyISO());
  const [cunas, setCunas] = useState<CunaAsignada[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarCunasAsignadas(fecha, setCunas, setError);
  }, [fecha]);

  return (
    <div style={{ textAlign: 'left' }}>
      <h1>Mis cunas</h1>

      <label>Fecha </label>
      <input
        type="date"
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
      />

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!error && cunas.length === 0 && (
        <p>No tienes cunas asignadas para este día.</p>
      )}

      {cunas.map((cuna) => (
        <Card key={cuna.id} title={cuna.identificador}>
          <p>Paciente: {cuna.paciente_detalle?.nombre ?? 'Cuna vacía'}</p>
          <p>Diagnóstico: {cuna.paciente_detalle?.diagnostico ?? '-'}</p>
          <p>
            FC: {cuna.ritmo_cardiaco ?? '-'} bpm | SpO2: {cuna.spo2 ?? '-'}% |
            Temp: {cuna.temperatura ?? '-'} °C
          </p>
        </Card>
      ))}
    </div>
  );
}
