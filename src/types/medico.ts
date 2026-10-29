/**
 * @file medico.ts
 * @description Catálogo de médicos responsables de pacientes.
 */

/** Médico o profesional tratante. */
export interface Medico {
  id: number;
  nombreCompleto: string;
  turno: string | null;
}

/** Payload de alta/edición de médicos. */
export interface MedicoPayload {
  nombreCompleto: string;
  turno?: string | null;
}
