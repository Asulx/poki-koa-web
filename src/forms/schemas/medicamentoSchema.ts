import { z } from 'zod';

/**
 * Esquema de validación Zod para el formulario de medicamentos.
 * Define las reglas de validación, coerción de tipos y mensajes de error
 * personalizados para cada campo del recurso farmacéutico.
 */
export const medicamentoSchema = z.object({
  /** Nombre comercial obligatorio del medicamento. */
  nombre: z.string().min(1, 'El nombre es obligatorio'),

  /** Principio activo o genérico obligatorio del medicamento. */
  principioActivo: z.string().min(1, 'El principio activo es obligatorio'),

  /** Valor numérico de la dosis, transformado automáticamente y mayor a 0. */
  dosis: z.coerce.number().min(1, 'La dosis debe ser mayor a 0'),

  /** Cantidad disponible en inventario, transformada automáticamente y no negativa. */
  stock: z.coerce.number().min(0, 'El stock no puede ser negativo'),
});

/**
 * Tipo TypeScript inferido automáticamente a partir del esquema `medicamentoSchema`.
 * Utilizado para tipar fuertemente los formularios y datos de gestión de medicamentos.
 */
export type MedicamentoFormData = z.infer<typeof medicamentoSchema>;
