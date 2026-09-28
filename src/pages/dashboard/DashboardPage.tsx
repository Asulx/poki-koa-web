import EstadisticasResumen from '@/components/estadisticas/EstadisticasResumen/EstadisticasResumen'
import Card from '@/components/ui/Card/Card'

import './DashboardPage.css'

export default function DashboardPage() {
  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <h1>Panel de control</h1>

        <p>
          Resumen general de la unidad de neonatología.
        </p>
      </header>

      <div className="dashboard__content">
        <main className="dashboard__metricas">
          <EstadisticasResumen />
        </main>

        <aside className="dashboard__resumen">
          <Card title="Resumen general">
            <ul className="dashboard__resumen-lista">
              <li className="dashboard__resumen-item">
                <strong>Estado de la unidad</strong>
                <span>
                  Información pendiente de disponibilidad.
                </span>
              </li>

              <li className="dashboard__resumen-item">
                <strong>Alertas recientes</strong>
                <span>
                  Sin información disponible.
                </span>
              </li>

              <li className="dashboard__resumen-item">
                <strong>Actividad reciente</strong>
                <span>
                  Sin información disponible.
                </span>
              </li>
            </ul>
          </Card>
        </aside>
      </div>
    </div>
  )
}