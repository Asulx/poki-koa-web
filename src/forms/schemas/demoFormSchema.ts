import { z } from 'zod';

/**
 * Esquema de validación Zod para el formulario de demostración.
 * Define las reglas de validación y los mensajes de error personalizados para cada campo,
 * cumpliendo con los estándares de robustez de la Guía 1.3 y el Issue #94.
 */
export const demoFormSchema = z.object({
  /** Nombre obligatorio del usuario. */
  nombre: z.string().min(1, 'El nombre es obligatorio'),

  /** Dirección de correo electrónico con formato válido. */
  correo: z.email('Correo inválido'),

  /** Edad numérica obligatoria mayor a 0 con mensaje personalizado. */
  edad: z
    .number({
      error: 'La edad es obligatoria',
    })
    .min(1, 'La edad debe ser mayor a 0'),
});

/**
 * Tipo TypeScript inferido automáticamente a partir del esquema `demoFormSchema`.
 * Utilizado para tipar fuertemente los formularios y datos asociados en los componentes.
 */
export type DemoFormData = z.infer<typeof demoFormSchema>;