/**
 * @file registrosService.ts
 * @description Consulta de la bitácora de auditoría (solo administradores).
 */

import { api } from '@/api/axios';
import {
  mapRegistro,
  mapResumenAuditoria,
  type ApiRegistro,
} from '@/api/mappers';
import type {
  FiltrosAuditoria,
  RegistroActividad,
  ResumenAuditoria,
} from '@/types/registro';

/**
 * Lista registros de auditoría aplicando filtros.
 *
 * @param filtros - Acción, entidad, usuario, rango de fechas o texto.
 * @returns Registros normalizados.
 */
export async function listarRegistros(
  filtros: FiltrosAuditoria = {}
): Promise<RegistroActividad[]> {
  const params: Record<string, string | number> = {};
  if (filtros.accion) params.accion = filtros.accion;
  if (filtros.entidad) params.entidad = filtros.entidad;
  if (filtros.usuarioId) params.usuario = filtros.usuarioId;
  if (filtros.desde) params.desde = filtros.desde;
  if (filtros.hasta) params.hasta = filtros.hasta;
  if (filtros.search?.trim()) params.search = filtros.search.trim();

  const { data } = await api.get<ApiRegistro[]>('/registros/', { params });
  return data.map(mapRegistro);
}

/**
 * Obtiene el conteo de registros agrupado por acción. Se aplican todos los
 * filtros salvo la acción, para que las tarjetas de resumen sigan mostrando
 * la distribución completa y permitan cambiar de acción con un clic.
 *
 * @param filtros - Entidad, usuario, rango de fechas o texto.
 * @returns Resumen por acción.
 */
export async function obtenerResumenRegistros(
  filtros: FiltrosAuditoria = {}
): Promise<ResumenAuditoria[]> {
  const params: Record<string, string | number> = {};
  if (filtros.entidad) params.entidad = filtros.entidad;
  if (filtros.usuarioId) params.usuario = filtros.usuarioId;
  if (filtros.desde) params.desde = filtros.desde;
  if (filtros.hasta) params.hasta = filtros.hasta;
  if (filtros.search?.trim()) params.search = filtros.search.trim();

  const { data } = await api.get<Array<{ accion: string; total: number }>>(
    '/registros/resumen/',
    { params }
  );
  return data.map(mapResumenAuditoria);
}

/** Servicio agrupado de auditoría. */
export const registrosService = {
  listar: listarRegistros,
  resumen: obtenerResumenRegistros,
};
