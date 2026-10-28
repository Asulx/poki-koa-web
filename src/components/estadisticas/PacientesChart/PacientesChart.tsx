import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import type { EstadisticaPacientes } from '@/types/reporte';

import './PacientesChart.css';

/**
 * Propiedades para el componente de gráfico de pacientes.
 */
type PacientesChartProps = {
  /** Arreglo con los datos estadísticos temporales del flujo de pacientes. */
  data: EstadisticaPacientes[];
};

/**
 * Componente visual encargado de renderizar un gráfico de líneas
 * para mostrar la evolución temporal del flujo de pacientes.
 *
 * @param props Contiene el arreglo de datos estadísticos para graficar.
 * @returns Una sección HTML estructurada con el gráfico responsivo o un mensaje de ausencia de datos.
 */
export default function PacientesChart({ data }: PacientesChartProps) {
  // Evita enviar datos inválidos a Recharts
  const datosSeguros = Array.isArray(data) ? data : [];

  return (
    <section className="pacientes-chart">
      <h2>Flujo de pacientes</h2>

      <div className="pacientes-chart__container">
        {datosSeguros.length === 0 ? (
          <p>No hay estadísticas disponibles.</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={datosSeguros}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="periodo" />

              <YAxis allowDecimals={false} />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="cantidad"
                strokeWidth={2}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}
