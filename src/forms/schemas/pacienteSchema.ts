import { z } from 'zod'

export const pacienteSchema = z.object({
  identificador: z
    .string()
    .trim()
    .min(1, 'El identificador es obligatorio')
    .max(30, 'El identificador no puede exceder los 30 caracteres'),

  nombre_completo: z
    .string()
    .min(1, 'El nombre completo es obligatorio')
    .max(200, 'El nombre no puede exceder los 200 caracteres'),

  edad_meses: z.coerce
    .number()
    .int('La edad en meses debe ser un número entero')
    .min(0, 'La edad debe ser mayor o igual a 0')
    .nullable()
    .optional(),

  sexo: z
    .enum(['M', 'F'])
    .nullable()
    .optional(),

  peso: z.coerce
    .number()
    .min(0.01, 'El peso debe ser mayor a 0 kg')
    .nullable()
    .optional(),

  fecha_nacimiento: z
    .string()
    .nullable()
    .optional()
    .refine(
      (val) => {
        if (!val) return true
        const fecha = new Date(val)
        const hoy = new Date()
        hoy.setHours(23, 59, 59, 999)
        return fecha <= hoy
      },
      { message: 'La fecha de nacimiento no puede ser futura' }
    ),

  fecha_ingreso: z.string().nullable().optional(),

  diagnostico: z.string().optional(),

  plan_cuidados: z.string().optional(),

  medico_a_cargo: z.coerce.number().nullable().optional(),
})

export type PacienteFormData = z.infer<typeof pacienteSchema>