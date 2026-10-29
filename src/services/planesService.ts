/**
 * @file planesService.ts
 * @description CRUD de planes de cuidado neonatal.
 */

import { api } from '@/api/axios';
import { mapPlan, type ApiPlan } from '@/api/mappers';
import type { EstadoPlan, PlanCuidado, PlanPayload } from '@/types/plan';

/** Filtros del listado de planes. */
export interface FiltrosPlanes {
  pacienteId?: number;
  estado?: EstadoPlan;
  search?: string;
}

/**
 * Lista planes de cuidado.
 *
 * @param filtros - Paciente, estado o texto.
 * @returns Planes normalizados.
 */
export async function listarPlanes(
  filtros: FiltrosPlanes = {}
): Promise<PlanCuidado[]> {
  const params: Record<string, string | number> = {};
  if (filtros.pacienteId) params.bebe = filtros.pacienteId;
  if (filtros.estado) params.estado = filtros.estado;
  if (filtros.search?.trim()) params.search = filtros.search.trim();

  const { data } = await api.get<ApiPlan[]>('/planes-cuidado/', { params });
  return data.map(mapPlan);
}

/**
 * Crea un plan de cuidado.
 *
 * @param payload - Datos validados.
 * @returns Plan creado.
 */
export async function crearPlan(payload: PlanPayload): Promise<PlanCuidado> {
  const { data } = await api.post<ApiPlan>('/planes-cuidado/', {
    bebe: payload.paciente,
    area_cuidado: payload.areaCuidado,
    intervencion: payload.intervencion,
    frecuencia: payload.frecuencia,
    estado: payload.estado,
  });
  return mapPlan(data);
}

/**
 * Actualiza un plan de cuidado.
 *
 * @param id - Identificador del plan.
 * @param payload - Datos validados.
 * @returns Plan actualizado.
 */
export async function actualizarPlan(
  id: number,
  payload: PlanPayload
): Promise<PlanCuidado> {
  const { data } = await api.patch<ApiPlan>(`/planes-cuidado/${id}/`, {
    bebe: payload.paciente,
    area_cuidado: payload.areaCuidado,
    intervencion: payload.intervencion,
    frecuencia: payload.frecuencia,
    estado: payload.estado,
  });
  return mapPlan(data);
}

/**
 * Elimina un plan de cuidado.
 *
 * @param id - Identificador del plan.
 */
export async function eliminarPlan(id: number): Promise<void> {
  await api.delete(`/planes-cuidado/${id}/`);
}

/** Servicio agrupado de planes. */
export const planesService = {
  listar: listarPlanes,
  crear: crearPlan,
  actualizar: actualizarPlan,
  eliminar: eliminarPlan,
};
