/**
 * @file medicamentosService.ts
 * @description Inventario farmacéutico (`/catalogo-medicamentos/`) y
 * prescripciones por paciente (`/medicamentos/`). Son recursos distintos.
 */

import { api } from '@/api/axios';
import {
  horaCorta,
  mapCatalogo,
  mapMedicamento,
  type ApiMedicamento,
} from '@/api/mappers';
import type {
  CatalogoPayload,
  EstadoPrescripcion,
  FiltrosCatalogo,
  Medicamento,
  MedicamentoCatalogo,
  MedicamentoPayload,
} from '@/types/medicamento';

/* ----------------------------- Catálogo ----------------------------- */

/**
 * Lista productos del inventario.
 *
 * @param filtros - Texto y filtro de stock crítico.
 * @returns Productos normalizados.
 */
export async function listarCatalogo(
  filtros: FiltrosCatalogo = {}
): Promise<MedicamentoCatalogo[]> {
  const params: Record<string, string | boolean> = {};
  if (filtros.search?.trim()) params.search = filtros.search.trim();
  if (filtros.stockBajo) params.stock_bajo = true;

  const { data } = await api.get<
    Array<{
      id: number;
      nombre: string;
      principio_activo: string;
      dosis_mg: string;
      stock: number;
    }>
  >('/catalogo-medicamentos/', { params });
  return data.map(mapCatalogo);
}

/**
 * Crea un producto del catálogo.
 *
 * @param payload - Datos validados.
 * @returns Producto creado.
 */
export async function crearCatalogo(
  payload: CatalogoPayload
): Promise<MedicamentoCatalogo> {
  const { data } = await api.post('/catalogo-medicamentos/', {
    nombre: payload.nombre,
    principio_activo: payload.principioActivo,
    dosis_mg: payload.dosisMg,
    stock: payload.stock,
  });
  return mapCatalogo(data);
}

/**
 * Actualiza un producto del catálogo.
 *
 * @param id - Identificador del producto.
 * @param payload - Datos validados.
 * @returns Producto actualizado.
 */
export async function actualizarCatalogo(
  id: number,
  payload: CatalogoPayload
): Promise<MedicamentoCatalogo> {
  const { data } = await api.patch(`/catalogo-medicamentos/${id}/`, {
    nombre: payload.nombre,
    principio_activo: payload.principioActivo,
    dosis_mg: payload.dosisMg,
    stock: payload.stock,
  });
  return mapCatalogo(data);
}

/* -------------------------- Prescripciones -------------------------- */

/** Filtros del listado de prescripciones. */
export interface FiltrosPrescripciones {
  pacienteId?: number;
  estado?: EstadoPrescripcion;
  search?: string;
}

/**
 * Lista prescripciones de medicamentos.
 *
 * @param filtros - Paciente, estado o texto.
 * @returns Prescripciones normalizadas.
 */
export async function listarPrescripciones(
  filtros: FiltrosPrescripciones = {}
): Promise<Medicamento[]> {
  const params: Record<string, string | number> = {};
  if (filtros.pacienteId) params.paciente = filtros.pacienteId;
  if (filtros.estado) params.estado = filtros.estado;
  if (filtros.search?.trim()) params.search = filtros.search.trim();

  const { data } = await api.get<ApiMedicamento[]>('/medicamentos/', {
    params,
  });
  return data.map(mapMedicamento);
}

/**
 * Crea una prescripción para un paciente.
 *
 * @param payload - Datos validados.
 * @returns Prescripción creada.
 */
export async function crearPrescripcion(
  payload: MedicamentoPayload
): Promise<Medicamento> {
  const { data } = await api.post<ApiMedicamento>('/medicamentos/', {
    paciente: payload.paciente,
    nombre: payload.nombre,
    dosis: payload.dosis,
    via: payload.via,
    hora: payload.hora,
    estado: payload.estado ?? 'Pendiente',
  });
  return mapMedicamento(data);
}

/**
 * Marca una prescripción como administrada.
 *
 * @param id - Identificador de la prescripción.
 */
export async function administrarPrescripcion(id: number): Promise<void> {
  await api.post(`/medicamentos/${id}/administrar/`);
}

/** Hora normalizada para formularios de prescripción. */
export const normalizarHora = horaCorta;

/** Servicio agrupado de medicamentos. */
export const medicamentosService = {
  listarCatalogo,
  crearCatalogo,
  actualizarCatalogo,
  listarPrescripciones,
  crearPrescripcion,
  administrar: administrarPrescripcion,
};
