/**
 * @file reportesService.ts
 * @description Métricas agregadas del dashboard, series temporales,
 * distribuciones y exportación CSV.
 */

import { api, descargarArchivo } from '@/api/axios';
import {
  mapDistribucion,
  mapResumen,
  mapSerie,
  type ApiResumen,
} from '@/api/mappers';
import type {
  DistribucionReporte,
  ResumenOperacion,
  SerieActividad,
} from '@/types/reporte';
import { fechaHoy } from '@/utils/fechas';

/**
 * Obtiene el resumen operacional completo.
 *
 * @returns Métricas del dashboard.
 */
export async function obtenerResumen(): Promise<ResumenOperacion> {
  const { data } = await api.get<ApiResumen>('/reportes/resumen/');
  return mapResumen(data);
}

/**
 * Obtiene la serie diaria de ingresos y alertas.
 *
 * @param dias - Cantidad de días hacia atrás (1 a 90).
 * @returns Serie normalizada.
 */
export async function obtenerSerie(dias = 14): Promise<SerieActividad> {
  const { data } = await api.get<{
    dias: number;
    serie: Array<{ fecha: string; ingresos: number; alertas: number }>;
  }>('/reportes/serie/', { params: { dias } });
  return mapSerie(data);
}

/**
 * Obtiene las distribuciones agregadas.
 *
 * @returns Distribuciones de cunas, alertas, medicamentos y personal.
 */
export async function obtenerDistribucion(): Promise<DistribucionReporte> {
  const { data } = await api.get('/reportes/distribucion/');
  return mapDistribucion(data);
}

/**
 * Descarga el resumen operacional en CSV. El nombre del archivo usa la fecha
 * institucional para que coincida con el reporte generado por el backend.
 */
export async function exportarResumenCsv(): Promise<void> {
  await descargarArchivo(
    '/reportes/exportar/',
    `reporte-poki-koa-${fechaHoy()}.csv`
  );
}

/** Servicio agrupado de reportes. */
export const reportesService = {
  resumen: obtenerResumen,
  serie: obtenerSerie,
  distribucion: obtenerDistribucion,
  exportarCsv: exportarResumenCsv,
};
