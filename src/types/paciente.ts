/**
 * @file paciente.ts
 * @description Definición de contratos de tipo e interfaces para la gestión de pacientes
 * y sus registros clínicos dentro de la unidad neonatal.
 */

export interface Paciente {
  id: number;
  nombre: string;
  fechaNacimiento: string;
  sexo: string;
  edadGestacional: string;
  peso: number;
  numeroCuna: string;
  fechaIngreso: string;
  medicoResponsable: string;
  diagnostico: string;
  estadoCanula: string;
  viaIntravenosa: string;
  observaciones?: string;
}