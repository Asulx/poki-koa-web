/**
 * @file asignacion.ts
 * @description Definición de contratos de tipo para la gestión de turnos,
 * personal, asignaciones de cunas y monitorización en tiempo real.
 */

export type Turno = {
  id: number;
  nombre: string;
  hora_inicio: string;
  hora_fin: string;
};

export type Personal = {
  id: number;
  username: string;
  nombre: string;
  rol: string;
};

export type CunaResumen = {
  id: number;
  identificador: string;
};

export type Asignacion = {
  id: number;
  usuario: number;
  usuario_nombre: string;
  cuna: number;
  cuna_identificador: string;
  turno: number;
  turno_nombre: string;
  fecha: string;
};

export type NuevaAsignacion = {
  usuario: number;
  cuna: number;
  turno: number;
  fecha: string;
};

export type CunaAsignada = {
  id: number;
  identificador: string;
  ritmo_cardiaco: number | null;
  spo2: number | null;
  temperatura: number | null;
  paciente_detalle: { nombre: string; diagnostico: string | null } | null;
};
