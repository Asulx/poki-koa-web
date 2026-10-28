/**
 * @file dashboardService.ts
 * @description Servicio encargado de obtener las métricas y resúmenes analíticos del panel principal (Dashboard)
 * para los perfiles de supervisión y jefatura clínica, utilizando el cliente HTTP centralizado.
 */

import { apiFetch } from '@/services/api';
import type { ResumenSupervisor } from '@/types/dashboard';

/**
 * Obtiene el resumen consolidado de supervisión para el panel principal.
 *
 * @returns Una promesa que resuelve con los datos tipados de tipo {@link ResumenSupervisor}.
 */
export const getResumenSupervisor = () =>
  apiFetch<ResumenSupervisor>('/dashboard/supervisor-summary/');
