/**
 * @file cunasService.ts
 * @description Operaciones sobre el mapa de cunas: listado, asignación de
 * pacientes, liberación y cambio de estado de mantenimiento.
 */

import { api } from '@/api/axios';
import { mapCuna, type ApiCuna } from '@/api/mappers';
import type { Cuna, EstadoCuna, FiltrosCunas } from '@/types/cuna';

/**
 * Lista cunas con filtros por estado o identificador.
 *
 * @param filtros - Filtros opcionales.
 * @returns Cunas normalizadas ordenadas por identificador.
 */
export async function listarCunas(filtros: FiltrosCunas = {}): Promise<Cuna[]> {
  const params: Record<string, string | boolean> = {};
  if (filtros.estado) params.estado = filtros.estado;
  if (filtros.search?.trim()) params.search = filtros.search.trim();
  if (filtros.enMantenimiento !== undefined) {
    params.en_mantenimiento = filtros.enMantenimiento;
  }

  const { data } = await api.get<ApiCuna[]>('/cunas/', { params });
  return data.map(mapCuna);
}

/**
 * Obtiene una cuna por su identificador interno.
 *
 * @param id - Identificador de la cuna.
 * @returns Cuna normalizada.
 */
export async function obtenerCuna(id: number): Promise<Cuna> {
  const { data } = await api.get<ApiCuna>(`/cunas/${id}/`);
  return mapCuna(data);
}

/**
 * Asigna un paciente activo a una cuna libre.
 *
 * @param cunaId - Identificador de la cuna.
 * @param pacienteId - Identificador del paciente.
 * @returns Cuna actualizada.
 */
export async function asignarPaciente(
  cunaId: number,
  pacienteId: number
): Promise<Cuna> {
  const { data } = await api.post<ApiCuna>(`/cunas/${cunaId}/asignar/`, {
    paciente: pacienteId,
  });
  return mapCuna(data);
}

/**
 * Libera una cuna ocupada.
 *
 * @param cunaId - Identificador de la cuna.
 * @returns Cuna actualizada.
 */
export async function liberarCuna(cunaId: number): Promise<Cuna> {
  const { data } = await api.post<ApiCuna>(`/cunas/${cunaId}/liberar/`);
  return mapCuna(data);
}

/**
 * Marca o desmarca una cuna como en mantenimiento.
 *
 * @param cunaId - Identificador de la cuna.
 * @param enMantenimiento - Nuevo estado.
 * @returns Cuna actualizada.
 */
export async function cambiarMantenimiento(
  cunaId: number,
  enMantenimiento: boolean
): Promise<Cuna> {
  const { data } = await api.patch<ApiCuna>(`/cunas/${cunaId}/`, {
    en_mantenimiento: enMantenimiento,
  });
  return mapCuna(data);
}

/**
 * Cuenta cunas por estado a partir de una lista ya cargada.
 *
 * @param cunas - Cunas a resumir.
 * @returns Conteo por estado.
 */
export function resumirCunas(cunas: Cuna[]): Record<EstadoCuna, number> {
  return cunas.reduce<Record<EstadoCuna, number>>(
    (acumulado, cuna) => {
      acumulado[cuna.estado] += 1;
      return acumulado;
    },
    { disponible: 0, ocupada: 0, mantenimiento: 0 }
  );
}

/** Servicio agrupado de cunas. */
export const cunasService = {
  listar: listarCunas,
  obtener: obtenerCuna,
  asignarPaciente,
  liberar: liberarCuna,
  cambiarMantenimiento,
  resumir: resumirCunas,
};
