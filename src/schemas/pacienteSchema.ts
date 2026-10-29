/**
 * @file pacienteSchema.ts
 * @description Validación del formulario de paciente neonatal. Los mensajes
 * están en español y reflejan las reglas del backend (`Bebe`).
 */

import { z } from 'zod';

/** Convierte cadenas vacías en `undefined` y el resto en número. */
const numeroOpcional = z.preprocess((valor) => {
  if (valor === '' || valor === null || valor === undefined) return undefined;
  const numero = Number(valor);
  return Number.isNaN(numero) ? undefined : numero;
}, z.number().min(0).max(50000).optional());

/** Esquema del formulario de alta/edición de paciente. */
export const pacienteSchema = z.object({
  identificador: z
    .string()
    .trim()
    .min(3, 'El identificador debe tener al menos 3 caracteres.')
    .max(20, 'El identificador admite hasta 20 caracteres.'),
  nombreCompleto: z
    .string()
    .trim()
    .min(3, 'El nombre completo es obligatorio.')
    .max(150, 'El nombre admite hasta 150 caracteres.'),
  edadMeses: z.preprocess(
    (valor) => {
      if (valor === '' || valor === null || valor === undefined)
        return undefined;
      return Number(valor);
    },
    z
      .number({ message: 'Ingresa la edad en meses.' })
      .min(0, 'La edad no puede ser negativa.')
      .max(24, 'La edad máxima admitida es 24 meses.')
  ),
  edadGestacional: numeroOpcional,
  sexo: z.enum(['F', 'M'], { message: 'Selecciona el sexo.' }),
  peso: numeroOpcional,
  fechaNacimiento: z
    .string()
    .trim()
    .refine(
      (valor) => !valor || !Number.isNaN(new Date(valor).getTime()),
      'La fecha de nacimiento no es válida.'
    )
    .optional(),
  diagnostico: z.string().trim().max(500).optional(),
  observaciones: z.string().trim().max(1000).optional(),
  planCuidados: z.string().trim().max(1000).optional(),
  medicoACargo: z.preprocess((valor) => {
    if (valor === '' || valor === null || valor === undefined) return undefined;
    const numero = Number(valor);
    return Number.isNaN(numero) ? undefined : numero;
  }, z.number().int().positive().optional()),
});

/** Datos inferidos del formulario. */
export type PacienteFormData = z.infer<typeof pacienteSchema>;
