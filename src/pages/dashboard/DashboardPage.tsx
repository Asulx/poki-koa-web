import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'

import Card from '@/components/ui/Card/Card'
import { useAuth } from '@/context/AuthContext'
import { getResumenSupervisor } from '@/services/dashboardService'
import type { ResumenSupervisor } from '@/types/dashboard'

import './DashboardPage.css'

// Panel que solo ve la jefatura: tarjetas de KPIs + consola de alertas
function PanelSupervisor() {
  const [resumen, setResumen] = useState<ResumenSupervisor | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const cargar = () =>
      getResumenSupervisor()
        .then((datos) => {
          setResumen(datos)
          setError('')
        })
        .catch((err: Error) => setError(err.message))

    cargar()
    const timer = setInterval(cargar, 30000) // refresca cada 30 segundos
    return () => clearInterval(timer) // limpiamos al salir de la página
  }, [])

  if (error) return <p style={{ color: 'red' }}>{error}</p>
  if (!resumen) return <p>Cargando panel...</p>

  const consola = [
    ...resumen.alertas_sistema.map((a) => ({
      clave: `sis-${a.mensaje}`,
      nivel: a.nivel,
      texto: a.mensaje,
    })),
    ...resumen.alertas_clinicas.map((a) => ({
      clave: `cli-${a.id}`,
      nivel: a.nivel,
      texto: `${a.cuna_identificador ?? 'Sin cuna'} · ${a.paciente_nombre ?? 'Sin paciente'}: ${a.mensaje}`,
    })),
  ]

  return (
    <div className="dashboard">
      <h1>Panel de Supervisión</h1>

      <div className="kpi-grid">
        <Card title="Ocupación">
          <p className="kpi-valor">{resumen.porcentaje_ocupacion}%</p>
          <p>{resumen.cunas_ocupadas} de {resumen.capacidad_total} cunas</p>
        </Card>
        <Card title="Cunas disponibles">
          <p className="kpi-valor">{resumen.cunas_disponibles}</p>
        </Card>
        <Card title="Ingresos">
          <p className="kpi-valor">{resumen.ingresos_hoy}</p>
          <p>hoy · {resumen.ingresos_7_dias} en 7 días</p>
        </Card>
        <Card title="Altas">
          <p className="kpi-valor">{resumen.altas_hoy}</p>
          <p>hoy · {resumen.altas_7_dias} en 7 días</p>
        </Card>
        <Card title="Alertas activas">
          <p className="kpi-valor">{resumen.alertas_activas.total}</p>
          <p>
            {resumen.alertas_activas.criticas} críticas ·{' '}
            {resumen.alertas_activas.advertencias} advertencias
          </p>
        </Card>
      </div>

      <h2 style={{ marginTop: 24 }}>Consola de alertas</h2>
      {consola.length === 0 && <p>Sin alertas activas.</p>}
      <ul className="consola">
        {consola.map((item) => (
          <li
            key={item.clave}
            className={item.nivel === 'Critica' ? 'alerta-critica' : 'alerta-advertencia'}
          >
            <strong>{item.nivel}</strong> — {item.texto}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function DashboardPage() {
  const { usuario } = useAuth()

  if (usuario?.rol === 'apoderado') return <Navigate to="/portal" replace />
  if (usuario?.rol === 'jefe' || usuario?.rol === 'admin') return <PanelSupervisor />

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Bienvenido/a. Revisa tus cunas asignadas en la sección "Mis cunas".</p>
    </div>
  )
}