/**
 * @file paciente.ts
 * @description Contratos del paciente neonatal (`Bebe`) y sus datos clínicos.
 */

import type { Alerta } from '@/types/alerta';
import type { Medicamento } from '@/types/medicamento';

/** Signos vitales reportados por la cuna del paciente. */
export interface SignosVitales {
  ritmoCardiaco: number | null;
  spo2: number | null;
  temperatura: number | null;
}

/** Datos demográficos y clínicos de un recién nacido. */
export interface Paciente {
  id: number;
  identificador: string;
  nombreCompleto: string;
  edadMeses: number;
  edadGestacional: number | null;
  sexo: 'F' | 'M';
  peso: number | null;
  fechaNacimiento: string | null;
  fechaIngreso: string;
  diagnostico: string;
  observaciones: string;
  planCuidados: string;
  activo: boolean;
  fechaAlta: string | null;
  motivoAlta: string;
  medicoId: number | null;
  medicoNombre: string | null;
  cunaId: number | null;
  cunaIdentificador: string | null;
  estadoCanula: boolean | null;
  viaIntravenosa: boolean | null;
  signosVitales: SignosVitales | null;
  medicamentos: Medicamento[];
  alertas: Alerta[];
}

/** Payload de creación/actualización enviado a `/api/bebes/`. */
export interface PacientePayload {
  identificador: string;
  nombreCompleto: string;
  edadMeses: number;
  edadGestacional?: number | null;
  sexo: 'F' | 'M';
  peso?: number | null;
  fechaNacimiento?: string | null;
  diagnostico?: string;
  observaciones?: string;
  planCuidados?: string;
  medicoACargo?: number | null;
}

/** Estado de hospitalización usado en filtros. */
export type EstadoPaciente = 'activo' | 'alta';

/** Respuesta esperada del listado (DRF sin paginación configurada). */
export type ListaPacientes = Paciente[];
