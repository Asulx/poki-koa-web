import { z } from 'zod';

/**
 * Esquema de validación Zod para el formulario de registro y edición de pacientes.
 * Define las reglas de validación estricta y los mensajes de error requeridos
 * para cada uno de los campos clínicos y administrativos del paciente.
 */
export const pacienteSchema = z.object({
  /** Nombre completo obligatorio del paciente. */
  nombre: z.string().min(1, 'Nombre obligatorio'),

  /** Fecha de nacimiento del paciente en formato de cadena. */
  fechaNacimiento: z.string().min(1, 'Fecha de nacimiento obligatoria'),

  /** Sexo biológico o género registrado del paciente. */
  sexo: z.string().min(1, 'Seleccione sexo'),

  /** Edad gestacional del paciente al nacer o evaluación actual. */
  edadGestacional: z.string().min(1, 'Edad gestacional obligatoria'),

  /** Peso actual del paciente en kilogramos (debe ser mayor a 0). */
  peso: z.number().min(0.1, 'Peso debe ser mayor a 0'),

  /** Identificador o número de cuna asignada en el área clínica. */
  numeroCuna: z.string().min(1, 'Número de cuna obligatorio'),

  /** Fecha de ingreso del paciente a la unidad o centro médico. */
  fechaIngreso: z.string().min(1, 'Fecha de ingreso obligatoria'),

  /** Nombre del médico especialista o responsable a cargo del paciente. */
  medicoResponsable: z.string().min(1, 'Médico obligatorio'),

  /** Diagnóstico clínico principal del paciente. */
  diagnostico: z.string().min(1, 'Diagnóstico obligatorio'),

  /** Estado actual o tipo de soporte de cánula respiratoria. */
  estadoCanula: z.string(),

  /** Descripción o estado de la vía intravenosa activa. */
  viaIntravenosa: z.string(),

  /** Notas, observaciones clínicas o comentarios adicionales opcionales. */
  observaciones: z.string().optional(),
});

/**
 * Tipo TypeScript inferido automáticamente a partir del esquema `pacienteSchema`.
 * Utilizado para tipar fuertemente los formularios y datos de pacientes en la aplicación.
 */
export type PacienteFormData = z.infer<typeof pacienteSchema>;
