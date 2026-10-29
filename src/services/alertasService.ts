/**
 * @file alertasService.ts
 * @description Consulta y resolución de alertas clínicas.
 */

import { api } from '@/api/axios';
import { mapAlerta, type ApiAlerta } from '@/api/mappers';
import type { Alerta, FiltrosAlertas, Notificacion } from '@/types/alerta';

/**
 * Lista alertas clínicas aplicando filtros.
 *
 * @param filtros - Filtros opcionales.
 * @returns Alertas normalizadas.
 */
export async function listarAlertas(
  filtros: FiltrosAlertas = {}
): Promise<Alerta[]> {
  const params: Record<string, string | number | boolean> = {};
  if (filtros.activa !== undefined) params.activa = filtros.activa;
  if (filtros.nivel) params.nivel = filtros.nivel;
  if (filtros.tipo) params.tipo = filtros.tipo;
  if (filtros.pacienteId) params.paciente = filtros.pacienteId;
  if (filtros.cunaId) params.cuna = filtros.cunaId;

  const { data } = await api.get<ApiAlerta[]>('/alertas/', { params });
  return data.map(mapAlerta);
}

/**
 * Recupera únicamente las alertas activas.
 *
 * @returns Alertas activas normalizadas.
 */
export async function listarAlertasActivas(): Promise<Alerta[]> {
  const { data } = await api.get<ApiAlerta[]>('/alertas/activas/');
  return data.map(mapAlerta);
}

/**
 * Marca una alerta como resuelta.
 *
 * @param id - Identificador de la alerta.
 * @returns Alerta actualizada.
 */
export async function resolverAlerta(id: number): Promise<Alerta> {
  const { data } = await api.post<{ alerta: ApiAlerta }>(
    `/alertas/${id}/resolver/`
  );
  return mapAlerta(data.alerta);
}

/**
 * Convierte alertas en notificaciones para la barra superior.
 *
 * @param alertas - Alertas activas.
 * @returns Notificaciones ordenadas de más reciente a más antigua.
 */
export function alertasANotificaciones(alertas: Alerta[]): Notificacion[] {
  return alertas
    .slice()
    .sort(
      (a, b) =>
        new Date(b.fechaHora).getTime() - new Date(a.fechaHora).getTime()
    )
    .map((alerta) => ({
      id: `alerta-${alerta.id}`,
      titulo:
        alerta.nivel === 'Critica'
          ? 'Alerta crítica'
          : alerta.nivel === 'Advertencia'
            ? 'Advertencia clínica'
            : 'Información clínica',
      detalle: `${alerta.mensaje}${
        alerta.cunaIdentificador ? ` · Cuna ${alerta.cunaIdentificador}` : ''
      }`,
      fechaHora: alerta.fechaHora,
      critica: alerta.nivel === 'Critica',
      leida: !alerta.activa,
      ruta: '/alertas',
    }));
}

/** Servicio agrupado de alertas. */
export const alertasService = {
  listar: listarAlertas,
  activas: listarAlertasActivas,
  resolver: resolverAlerta,
};
