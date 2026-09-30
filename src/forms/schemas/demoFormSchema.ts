import { z } from 'zod'

export const demoFormSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  correo: z.email('Correo inválido'),
  edad: z
  .number({
    error: 'La edad es obligatoria',
  })
  .min(1, 'La edad debe ser mayor a 0')
})

export type DemoFormData = z.infer<typeof demoFormSchema>