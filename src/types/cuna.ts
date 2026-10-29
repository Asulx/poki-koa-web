/**
 * @file cuna.ts
 * @description Contratos de la unidad física de monitoreo (`Cuna`).
 */

import type { Paciente } from '@/types/paciente';

/** Estado operativo derivado por el backend. */
export type EstadoCuna = 'disponible' | 'ocupada' | 'mantenimiento';

/** Cuna con su paciente y telemetría más reciente. */
export interface Cuna {
  id: number;
  identificador: string;
  estado: EstadoCuna;
  pacienteId: number | null;
  pacienteNombre: string | null;
  pacienteIdentificador: string | null;
  pacienteDetalle: Paciente | null;
  tieneAlertaCritica: boolean;
  ritmoCardiaco: number | null;
  spo2: number | null;
  temperatura: number | null;
  estadoSueno: string;
  canulaOk: boolean;
  viaIvActiva: boolean;
  enMantenimiento: boolean;
  ultimaActualizacion: string;
}

/** Filtros aceptados por `GET /api/cunas/`. */
export interface FiltrosCunas {
  estado?: EstadoCuna;
  search?: string;
  enMantenimiento?: boolean;
}

/** Payload de telemetría aceptado por la API (para simuladores). */
export interface TelemetriaCuna {
  ritmoCardiaco?: number;
  spo2?: number;
  temperatura?: number;
  estadoSueno?: 'Dormido' | 'Despierto';
  canulaOk?: boolean;
  viaIvActiva?: boolean;
}
