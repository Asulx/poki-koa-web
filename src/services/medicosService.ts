/**
 * @file medicosService.ts
 * @description Catálogo de médicos tratantes.
 */

import { api } from '@/api/axios';
import { mapMedico } from '@/api/mappers';
import type { Medico } from '@/types/medico';

/**
 * Lista médicos, opcionalmente filtrados por texto.
 *
 * @param search - Texto a buscar en el nombre.
 * @returns Médicos normalizados.
 */
export async function listarMedicos(search?: string): Promise<Medico[]> {
  const { data } = await api.get<
    Array<{ id: number; nombre_completo: string; turno: string | null }>
  >('/medicos/', {
    params: search?.trim() ? { search: search.trim() } : undefined,
  });
  return data.map(mapMedico);
}

/** Servicio agrupado de médicos. */
export const medicosService = { listar: listarMedicos };
