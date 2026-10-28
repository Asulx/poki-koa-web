/**
 * @file turnosService.ts
 * @description Servicio encargado de la gestión de turnos, personal clínico, cunas
 * y asignaciones operativas en la unidad neonatal, utilizando el cliente HTTP centralizado.
 */

import { apiFetch } from '@/services/api';
import type {
  Asignacion,
  CunaAsignada,
  CunaResumen,
  NuevaAsignacion,
  Personal,
  Turno,
} from '@/types/turnos';

/**
 * Obtiene el listado de turnos configurados en el sistema.
 *
 * @returns Una promesa que resuelve con un arreglo de objetos de tipo {@link Turno}.
 */
export const getTurnos = () => apiFetch<Turno[]>('/turnos/');

/**
 * Obtiene el listado del personal clínico disponible.
 *
 * @returns Una promesa que resuelve con un arreglo de objetos de tipo {@link Personal}.
 */
export const getPersonal = () => apiFetch<Personal[]>('/personal/');

/**
 * Obtiene un resumen general del estado de las cunas en la unidad.
 *
 * @returns Una promesa que resuelve con un arreglo de objetos de tipo {@link CunaResumen}.
 */
export const getCunas = () => apiFetch<CunaResumen[]>('/cunas/');

/**
 * Obtiene las asignaciones correspondientes a una fecha específica.
 *
 * @param fecha - Cadena de texto con la fecha a consultar (formato YYYY-MM-DD).
 * @returns Una promesa que resuelve con un arreglo de objetos de tipo {@link Asignacion}.
 */
export const getAsignaciones = (fecha: string) =>
  apiFetch<Asignacion[]>(`/asignaciones/?fecha=${fecha}`);

/**
 * Crea una nueva asignación operativa en el sistema.
 *
 * @param datos - Objeto de tipo {@link NuevaAsignacion} con la información de la nueva asignación.
 * @returns Una promesa que resuelve con el objeto {@link Asignacion} creado.
 */
export const crearAsignacion = (datos: NuevaAsignacion) =>
  apiFetch<Asignacion>('/asignaciones/', {
    method: 'POST',
    body: JSON.stringify(datos),
  });

/**
 * Elimina una asignación existente a partir de su identificador único.
 *
 * @param id - Identificador numérico único de la asignación a eliminar.
 * @returns Una promesa que resuelve cuando la operación se completa con éxito.
 */
export const eliminarAsignacion = (id: number) =>
  apiFetch<void>(`/asignaciones/${id}/`, { method: 'DELETE' });

/**
 * Obtiene las cunas asignadas al usuario en sesión para una fecha determinada.
 *
 * @param fecha - Cadena de texto con la fecha a consultar (formato YYYY-MM-DD).
 * @returns Una promesa que resuelve con un arreglo de objetos de tipo {@link CunaAsignada}.
 */
export const getMisCunas = (fecha: string) =>
  apiFetch<CunaAsignada[]>(`/asignaciones/mis-cunas/?fecha=${fecha}`);
