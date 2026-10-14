
import { z } from 'zod'

const obligatorio = (mensaje: string) =>
  z.string().trim().min(1, mensaje)

const fechaValida = (mensaje: string) =>
  z.iso.date({ error: mensaje })

export const pacienteSchema = z
  .object({
    identificador: obligatorio('Identificador obligatorio')
      .max(30, 'Máximo 30 caracteres'),

    nombre: obligatorio('Nombre obligatorio')
      .max(200, 'Máximo 200 caracteres'),

    fechaNacimiento: fechaValida('Fecha de nacimiento inválida'),

    sexo: z.enum(['Femenino', 'Masculino'], {
      error: 'Seleccione un sexo válido',
    }),

    edadGestacional: obligatorio('Edad gestacional obligatoria')
      .refine(
        (valor) =>
          /^\d+(\.\d)?$/.test(valor) &&
          Number(valor) > 0 &&
          Number(valor) <= 99.9,
        'Ingrese semanas válidas, por ejemplo 38.5'
      ),

    peso: z.number().finite().positive(
      'El peso debe ser mayor a 0'
    ),

    fechaIngreso: fechaValida('Fecha de ingreso inválida'),

    medicoResponsable: obligatorio('Seleccione un médico'),

    diagnostico: obligatorio('Diagnóstico obligatorio'),

    observaciones: z.string().optional(),
  })
  .refine(
    (data) => data.fechaNacimiento <= data.fechaIngreso,
    {
      path: ['fechaIngreso'],
      message: 'El ingreso no puede ser anterior al nacimiento',
    }
  )
  .refine(
    (data) => data.fechaNacimiento <= new Date().toISOString().slice(0, 10),
    {
      path: ['fechaNacimiento'],
      message: 'La fecha de nacimiento no puede ser futura',
    }
  )

export type PacienteFormData = z.infer<typeof pacienteSchema>
