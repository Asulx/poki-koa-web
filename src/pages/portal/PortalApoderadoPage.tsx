import { useEffect, useState } from 'react';

import Card from '@/components/ui/Card/Card';
import { getMisHijos } from '@/services/portalService';
import type { HijoPortal } from '@/types/portal';

/** Mensaje estándar predeterminado cuando la información médica se encuentra restringida o no autorizada. */
const NO_AUTORIZADO =
  'Información no disponible (no autorizada por el equipo médico)';

/**
 * Función auxiliar asíncrona para recuperar la información del portal de apoderados.
 * Extraída para mantener el cuerpo principal del componente plano y legible.
 *
 * @param setHijos - Función para actualizar el estado con el arreglo de hijos/pacientes.
 * @param setError - Función para actualizar el estado en caso de error.
 * @param setCargando - Función para gestionar el indicador de carga.
 */
async function cargarDatosPortal(
  setHijos: (hijos: HijoPortal[]) => void,
  setError: (error: string) => void,
  setCargando: (cargando: boolean) => void
) {
  try {
    const data = await getMisHijos();
    setHijos(data);
  } catch (err) {
    const errorObj = err as Error;
    setError(errorObj.message);
  } finally {
    setCargando(false);
  }
}

/**
 * Componente de página del Portal de Apoderados (Solo lectura).
 * Muestra de forma segura y estructurada el estado clínico, signos vitales, medicamentos
 * y detalles generales de los pacientes asociados a la cuenta del apoderado.
 *
 * @returns Un elemento JSX con la vista en modo lectura del estado de los infantes.
 */
export default function PortalApoderadoPage() {
  const [hijos, setHijos] = useState<HijoPortal[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarDatosPortal(setHijos, setError, setCargando);
  }, []);

  if (cargando) return <p>Cargando información...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (hijos.length === 0)
    return <p>No tienes pacientes asociados a tu cuenta.</p>;

  return (
    <div style={{ textAlign: 'left' }}>
      <h1>Estado de mi bebé</h1>

      {hijos.map((hijo) => (
        <Card
          key={hijo.paciente_id}
          title={`${hijo.nombre} (${hijo.parentesco || 'Apoderado'})`}
        >
          <p>Cuna: {hijo.cuna ?? 'Sin cuna asignada'}</p>
          <p>
            Sexo: {hijo.sexo} · Peso: {hijo.peso ?? '-'} kg
          </p>
          <p>Nacimiento: {hijo.fecha_nacimiento ?? '-'}</p>
          <p>
            Ingreso a la unidad:{' '}
            {new Date(hijo.fecha_ingreso).toLocaleString('es-CL')}
          </p>

          <h3>Diagnóstico</h3>
          <p>{hijo.diagnostico ?? NO_AUTORIZADO}</p>

          <h3>Signos vitales</h3>
          {hijo.signos_vitales ? (
            <p>
              Frecuencia cardíaca: {hijo.signos_vitales.ritmo_cardiaco ?? '-'}{' '}
              bpm · SpO2: {hijo.signos_vitales.spo2 ?? '-'}% · Temperatura:{' '}
              {hijo.signos_vitales.temperatura ?? '-'} °C
            </p>
          ) : (
            <p>{NO_AUTORIZADO}</p>
          )}

          <h3>Medicación</h3>
          {hijo.medicamentos === null ? (
            <p>{NO_AUTORIZADO}</p>
          ) : hijo.medicamentos.length === 0 ? (
            <p>Sin medicamentos registrados.</p>
          ) : (
            <ul>
              {hijo.medicamentos.map((m, i) => (
                <li key={i}>
                  {m.nombre} {m.dosis} ({m.via}) a las {m.hora.slice(0, 5)}:{' '}
                  {m.estado}
                </li>
              ))}
            </ul>
          )}
        </Card>
      ))}
    </div>
  );
}
