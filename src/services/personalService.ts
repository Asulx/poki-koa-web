/**
 * @file personalService.ts
 * @description Consulta del personal clínico (`/api/personal/`).
 */

import { api } from '@/api/axios';
import { mapUsuario, type ApiUsuario } from '@/api/mappers';
import type { Rol, Usuario } from '@/types/auth';

/** Filtros del listado de personal. */
export interface FiltrosPersonal {
  rol?: Rol;
  activo?: boolean;
  search?: string;
}

/**
 * Lista el personal clínico registrado.
 *
 * @param filtros - Rol, estado o texto.
 * @returns Personal normalizado.
 */
export async function listarPersonal(
  filtros: FiltrosPersonal = {}
): Promise<Usuario[]> {
  const params: Record<string, string | boolean> = {};
  if (filtros.rol) params.rol = filtros.rol;
  if (filtros.activo !== undefined) params.activo = filtros.activo;
  if (filtros.search?.trim()) params.search = filtros.search.trim();

  const { data } = await api.get<ApiUsuario[]>('/personal/', { params });
  return data.map(mapUsuario);
}

/** Servicio agrupado de personal. */
export const personalService = { listar: listarPersonal };
