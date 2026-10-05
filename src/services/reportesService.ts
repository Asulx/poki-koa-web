import { api } from '@/api/axios'

import type {
  DatosReporte,
  MetricasGenerales,
  EstadisticaPacientes,
} from '@/types/reporte'

const REPORTES_ENDPOINT = '/reportes'

export async function obtenerDatosReporte(): Promise<DatosReporte> {
  const response = await api.get<DatosReporte>(
    REPORTES_ENDPOINT
  )

  return response.data
}

export async function getMetricasGenerales(): Promise<MetricasGenerales> {
  const response = await api.get<MetricasGenerales>(
    `${REPORTES_ENDPOINT}/metricas`
  )

  return response.data
}

export async function getEstadisticasPacientes(): Promise<
  EstadisticaPacientes[]
> {
  const response = await api.get<EstadisticaPacientes[]>(
    `${REPORTES_ENDPOINT}/pacientes`
  )

  return response.data
}