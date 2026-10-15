import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import type { EstadisticaPacientes } from '@/types/reporte'

import './PacientesChart.css'

type PacientesChartProps = {
  data: EstadisticaPacientes[]
}

export default function PacientesChart({
  data,
}: PacientesChartProps) {
  return (
    <section className="pacientes-chart">
      <h2>Flujo de pacientes</h2>

      <div className="pacientes-chart__container">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <LineChart data={data}>
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
      </div>
    </section>
  )
}