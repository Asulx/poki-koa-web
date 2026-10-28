/**
 * @file reportesService.ts
 * @description Servicio encargado de la obtención de reportes, métricas generales del sistema
 * y estadísticas de pacientes para la visualización analítica de la unidad neonatal.
 */

import { api } from '@/api/axios';

import type {
  DatosReporte,
  MetricasGenerales,
  EstadisticaPacientes,
} from '@/types/reporte';

const REPORTES_ENDPOINT = '/reportes';

/**
 * Obtiene el conjunto completo de datos analíticos para la generación de reportes.
 * 
 * @returns Una promesa que resuelve con los datos de tipo {@link DatosReporte}.
 */
export async function obtenerDatosReporte(): Promise<DatosReporte> {
  const response = await api.get<DatosReporte>(REPORTES_ENDPOINT);

  return response.data;
}

/**
 * Obtiene las métricas generales y de rendimiento del sistema neonatal.
 * 
 * @returns Una promesa que resuelve con un objeto de tipo {@link MetricasGenerales}.
 */
export async function getMetricasGenerales(): Promise<MetricasGenerales> {
  const response = await api.get<MetricasGenerales>(
    `${REPORTES_ENDPOINT}/metricas`
  );

  return response.data;
}

/**
 * Obtiene las estadísticas desagregadas por paciente para análisis clínico y administrativo.
 * 
 * @returns Una promesa que resuelve con un arreglo de objetos de tipo {@link EstadisticaPacientes}.
 */
export async function getEstadisticasPacientes(): Promise<
  EstadisticaPacientes[]
> {
  const response = await api.get<EstadisticaPacientes[]>(
    `${REPORTES_ENDPOINT}/pacientes`
  );

  return response.data;
}