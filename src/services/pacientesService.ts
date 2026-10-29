/**
 * @file pacientesService.ts
 * @description Gestión integral de pacientes (`/api/bebes/`), incluyendo
 * altas clínicas.
 */

import { api } from '@/api/axios';
import { mapPaciente, mapPacientePayload, type ApiBebe } from '@/api/mappers';
import type { Paciente, PacientePayload } from '@/types/paciente';

/** Filtros aceptados por el listado de pacientes. */
export interface FiltrosPacientes {
  search?: string;
  sexo?: 'F' | 'M';
  activo?: boolean;
  medicoId?: number;
  cuna?: string;
  fechaIngreso?: string;
}

/**
 * Lista pacientes aplicando filtros del backend.
 *
 * @param filtros - Búsqueda y filtros opcionales.
 * @returns Pacientes normalizados.
 */
export async function listarPacientes(
  filtros: FiltrosPacientes = {}
): Promise<Paciente[]> {
  const params: Record<string, string | number | boolean> = {};

  if (filtros.search?.trim()) params.search = filtros.search.trim();
  if (filtros.sexo) params.sexo = filtros.sexo;
  if (filtros.activo !== undefined) params.activo = filtros.activo;
  if (filtros.medicoId) params.medico_a_cargo = filtros.medicoId;
  if (filtros.cuna?.trim()) params.cuna = filtros.cuna.trim();
  if (filtros.fechaIngreso) params.fecha_ingreso = filtros.fechaIngreso;

  const { data } = await api.get<ApiBebe[]>('/bebes/', { params });
  return data.map(mapPaciente);
}

/**
 * Obtiene el detalle de un paciente.
 *
 * @param id - Identificador interno.
 * @returns Paciente normalizado.
 */
export async function obtenerPaciente(id: number): Promise<Paciente> {
  const { data } = await api.get<ApiBebe>(`/bebes/${id}/`);
  return mapPaciente(data);
}

/**
 * Registra un paciente nuevo.
 *
 * @param payload - Datos clínicos validados por el formulario.
 * @returns Paciente creado.
 */
export async function crearPaciente(
  payload: PacientePayload
): Promise<Paciente> {
  const { data } = await api.post<ApiBebe>(
    '/bebes/',
    mapPacientePayload(payload)
  );
  return mapPaciente(data);
}

/**
 * Actualiza parcialmente un paciente.
 *
 * @param id - Identificador interno.
 * @param payload - Campos a modificar.
 * @returns Paciente actualizado.
 */
export async function actualizarPaciente(
  id: number,
  payload: PacientePayload
): Promise<Paciente> {
  const { data } = await api.patch<ApiBebe>(
    `/bebes/${id}/`,
    mapPacientePayload(payload)
  );
  return mapPaciente(data);
}

/**
 * Registra el alta clínica y libera la cuna del paciente.
 *
 * @param id - Identificador interno.
 * @param motivo - Motivo o destino del alta.
 * @returns Paciente actualizado.
 */
export async function darDeAltaPaciente(
  id: number,
  motivo: string
): Promise<Paciente> {
  const { data } = await api.post<ApiBebe>(`/bebes/${id}/alta/`, { motivo });
  return mapPaciente(data);
}

/** Servicio agrupado para consumo desde componentes. */
export const pacientesService = {
  listar: listarPacientes,
  obtener: obtenerPaciente,
  crear: crearPaciente,
  actualizar: actualizarPaciente,
  darDeAlta: darDeAltaPaciente,
};
