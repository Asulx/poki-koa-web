/**
 * @file turnosService.ts
 * @description Turnos, asignaciones de personal y cunas del profesional.
 */

import { api } from '@/api/axios';
import {
  mapAsignacion,
  mapAsignacionPayload,
  mapRespuestaMisCunas,
  mapTurno,
  type ApiAsignacion,
  type ApiMisCunas,
  type ApiTurno,
} from '@/api/mappers';
import type {
  Asignacion,
  AsignacionPayload,
  RespuestaMisCunas,
  Turno,
} from '@/types/turnos';

/**
 * Lista el catálogo de turnos.
 *
 * @param soloActivos - Si es `true`, filtra los turnos habilitados.
 * @returns Turnos normalizados.
 */
export async function listarTurnos(soloActivos = false): Promise<Turno[]> {
  const { data } = await api.get<ApiTurno[]>('/turnos/', {
    params: soloActivos ? { activo: true } : undefined,
  });
  return data.map(mapTurno);
}

/**
 * Obtiene el turno vigente según la hora local del servidor.
 *
 * @returns Turno actual o `null` si no hay ninguno que cubra la hora.
 */
export async function obtenerTurnoActual(): Promise<Turno | null> {
  const { data } = await api.get<{ turno: ApiTurno | null }>('/turnos/actual/');
  return data.turno ? mapTurno(data.turno) : null;
}

/**
 * Lista asignaciones de un día.
 *
 * @param fecha - Fecha ISO (`YYYY-MM-DD`).
 * @returns Asignaciones normalizadas.
 */
export async function listarAsignaciones(fecha: string): Promise<Asignacion[]> {
  const { data } = await api.get<ApiAsignacion[]>('/asignaciones/', {
    params: { fecha },
  });
  return data.map(mapAsignacion);
}

/**
 * Crea una asignación de personal a turno y cuna.
 *
 * @param payload - Datos validados.
 * @returns Asignación creada.
 */
export async function crearAsignacion(
  payload: AsignacionPayload
): Promise<Asignacion> {
  const { data } = await api.post<ApiAsignacion>(
    '/asignaciones/',
    mapAsignacionPayload(payload)
  );
  return mapAsignacion(data);
}

/**
 * Elimina una asignación.
 *
 * @param id - Identificador de la asignación.
 */
export async function eliminarAsignacion(id: number): Promise<void> {
  await api.delete(`/asignaciones/${id}/`);
}

/**
 * Recupera las cunas cubiertas hoy por el usuario autenticado.
 *
 * @returns Fecha, total y cunas asignadas.
 */
export async function obtenerMisCunas(): Promise<RespuestaMisCunas> {
  const { data } = await api.get<{
    fecha: string;
    total: number;
    cunas: ApiMisCunas[];
  }>('/mis-cunas/');
  return mapRespuestaMisCunas(data);
}

/** Servicio agrupado de turnos. */
export const turnosService = {
  listarTurnos,
  turnoActual: obtenerTurnoActual,
  listarAsignaciones,
  crearAsignacion,
  eliminarAsignacion,
  misCunas: obtenerMisCunas,
};
