import { z } from 'zod'

export const pacienteSchema = z.object({
  nombre: z.string().min(1, 'Nombre obligatorio'),

  fechaNacimiento: z.string().min(
    1,
    'Fecha de nacimiento obligatoria'
  ),

  sexo: z.string().min(1, 'Seleccione sexo'),

  edadGestacional: z.string().min(
    1,
    'Edad gestacional obligatoria'
  ),

  peso: z.number().min(
    0.1,
    'Peso debe ser mayor a 0'
  ),

  numeroCuna: z.string().min(
    1,
    'Número de cuna obligatorio'
  ),

  fechaIngreso: z.string().min(
    1,
    'Fecha de ingreso obligatoria'
  ),

  medicoResponsable: z.string().min(
    1,
    'Médico obligatorio'
  ),

  diagnostico: z.string().min(
    1,
    'Diagnóstico obligatorio'
  ),

  estadoCanula: z.string(),

  viaIntravenosa: z.string(),

  observaciones: z.string().optional(),
})

export type PacienteFormData =
  z.infer<typeof pacienteSchema>