/**
 * @file portalService.ts
 * @description Servicio encargado de gestionar las consultas del portal para apoderados y familiares,
 * permitiendo obtener la lista de hijos o neonatos asociados al usuario mediante el cliente HTTP centralizado.
 */

import { apiFetch } from '@/services/api';
import type { HijoPortal } from '@/types/portal';

/**
 * Obtiene el listado de hijos/neonatos asociados al apoderado autenticado en el portal.
 * 
 * @returns Una promesa que resuelve con un arreglo de objetos de tipo {@link HijoPortal}.
 */
export const getMisHijos = () => apiFetch<HijoPortal[]>('/portal/mis-hijos/');