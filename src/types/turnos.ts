/**
 * @file turnos.ts
 * @description Contratos de turnos, asignaciones de personal y vista
 * "mis cunas" del profesional autenticado.
 */

import type { Rol } from '@/types/auth';

/** Turno de trabajo configurado por la jefatura. */
export interface Turno {
  id: number;
  nombre: string;
  horaInicio: string;
  horaFin: string;
  activo: boolean;
  duracionHoras: number;
}

/** Asignación de una persona a un turno y (opcionalmente) a una cuna. */
export interface Asignacion {
  id: number;
  usuarioId: number;
  usuarioNombre: string;
  usuarioIniciales: string;
  usuarioRol: Rol | null;
  turnoId: number;
  turnoNombre: string;
  turnoHoraInicio: string;
  turnoHoraFin: string;
  cunaId: number | null;
  cunaIdentificador: string | null;
  fecha: string;
  creadoPor: number | null;
  creadoEn: string;
}

/** Payload para crear una asignación. */
export interface AsignacionPayload {
  usuario: number;
  turno: number;
  cuna: number | null;
  fecha: string;
}

/** Cuna cubierta hoy por el usuario autenticado. */
export interface MisCunas {
  cunaId: number;
  cunaIdentificador: string;
  turno: string;
  horaInicio: string;
  horaFin: string;
  pacienteId: number | null;
  pacienteNombre: string | null;
  pacienteIdentificador: string | null;
  ritmoCardiaco: number | null;
  spo2: number | null;
  temperatura: number | null;
  alertasActivas: number;
}

/** Respuesta de `GET /api/mis-cunas/`. */
export interface RespuestaMisCunas {
  fecha: string;
  total: number;
  cunas: MisCunas[];
}
