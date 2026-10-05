import { useEffect, useState } from 'react'

import EstadisticaCard from '@/components/estadisticas/EstadisticaCard/EstadisticaCard'
import PacientesChart from '@/components/estadisticas/PacientesChart/PacientesChart'

import {
  getEstadisticasPacientes,
  getMetricasGenerales,
} from '@/services/reportesService'

import type {
  EstadisticaPacientes,
  MetricasGenerales,
} from '@/types/reporte'

import './EstadisticasResumen.css'

export default function EstadisticasResumen() {
  const [metricas, setMetricas] =
    useState<MetricasGenerales | null>(null)

  const [estadisticasPacientes, setEstadisticasPacientes] =
    useState<EstadisticaPacientes[]>([])

  const [isLoading, setIsLoading] =
    useState(true)

  const [error, setError] =
    useState<string | null>(null)

  useEffect(() => {
    async function cargarEstadisticas() {
      try {
        setIsLoading(true)
        setError(null)

        const [
          metricasResponse,
          pacientesResponse,
        ] = await Promise.all([
          getMetricasGenerales(),
          getEstadisticasPacientes(),
        ])

        setMetricas(metricasResponse)
        setEstadisticasPacientes(
          pacientesResponse
        )
      } catch (error) {
        console.error(
          'Error al cargar estadísticas:',
          error
        )

        setError(
          'No fue posible cargar las estadísticas.'
        )
      } finally {
        setIsLoading(false)
      }
    }

    cargarEstadisticas()
  }, [])

  if (isLoading) {
    return (
      <p>Cargando estadísticas...</p>
    )
  }

  if (error) {
    return <p>{error}</p>
  }

  if (!metricas) {
    return (
      <p>
        No hay estadísticas disponibles.
      </p>
    )
  }

  return (
    <section className="estadisticas-resumen">
      <div className="estadisticas-resumen__cards">
        <EstadisticaCard
          titulo="Total de pacientes"
          valor={metricas.totalPacientes}
        />

        <EstadisticaCard
          titulo="Pacientes activos"
          valor={metricas.pacientesActivos}
        />

        <EstadisticaCard
          titulo="Total de medicamentos"
          valor={metricas.totalMedicamentos}
        />

        <EstadisticaCard
          titulo="Medicamentos con stock crítico"
          valor={
            metricas.medicamentosStockCritico
          }
        />
      </div>

      <PacientesChart
        data={estadisticasPacientes}
      />
    </section>
  )
}