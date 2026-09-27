import { z } from 'zod'

export const medicamentoSchema = z.object({
  nombre: z.string().min(
    1,
    'El nombre es obligatorio'
  ),

  principioActivo: z.string().min(
    1,
    'El principio activo es obligatorio'
  ),

  dosis: z.coerce.number().min(
    1,
    'La dosis debe ser mayor a 0'
  ),

  stock: z.coerce.number().min(
    0,
    'El stock no puede ser negativo'
  ),
})

export type MedicamentoFormData =
  z.infer<typeof medicamentoSchema>