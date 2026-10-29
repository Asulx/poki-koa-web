/**
 * @file plan.ts
 * @description Contratos de los planes de cuidado neonatal.
 */

/** Estado de un plan de cuidado. */
export type EstadoPlan = 'Activo' | 'Suspendido' | 'Finalizado';

/** Protocolo de atención asignado a un paciente. */
export interface PlanCuidado {
  id: number;
  pacienteId: number;
  pacienteNombre: string;
  cuna: string;
  areaCuidado: string;
  intervencion: string;
  frecuencia: string;
  estado: EstadoPlan;
}

/** Payload para crear o actualizar un plan. */
export interface PlanPayload {
  paciente: number;
  areaCuidado: string;
  intervencion: string;
  frecuencia: string;
  estado: EstadoPlan;
}
