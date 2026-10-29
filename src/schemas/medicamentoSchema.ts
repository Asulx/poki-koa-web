/**
 * @file medicamentoSchema.ts
 * @description Esquemas del inventario farmacéutico y de las prescripciones.
 */

import { z } from 'zod';

/** Convierte a número entero no negativo. */
const enteroNoNegativo = z.preprocess(
  (valor) => {
    if (valor === '' || valor === null || valor === undefined) return undefined;
    return Number(valor);
  },
  z
    .number({ message: 'Ingresa un número válido.' })
    .int('Debe ser un número entero.')
    .min(0, 'No puede ser negativo.')
);

/** Esquema del producto del catálogo. */
export const catalogoSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(2, 'El nombre comercial es obligatorio.')
    .max(120, 'Máximo 120 caracteres.'),
  principioActivo: z
    .string()
    .trim()
    .min(2, 'El principio activo es obligatorio.')
    .max(120, 'Máximo 120 caracteres.'),
  dosisMg: z.preprocess(
    (valor) => {
      if (valor === '' || valor === null || valor === undefined)
        return undefined;
      return Number(valor);
    },
    z
      .number({ message: 'Ingresa la dosis.' })
      .positive('La dosis debe ser mayor que cero.')
      .max(10000, 'Dosis fuera de rango.')
  ),
  stock: enteroNoNegativo,
});

/** Datos del formulario de catálogo. */
export type CatalogoFormData = z.infer<typeof catalogoSchema>;

/** Esquema de la prescripción médica. */
export const prescripcionSchema = z.object({
  paciente: z.preprocess(
    (valor) => {
      if (valor === '' || valor === null || valor === undefined)
        return undefined;
      return Number(valor);
    },
    z
      .number({ message: 'Selecciona un paciente.' })
      .int()
      .positive('Selecciona un paciente.')
  ),
  nombre: z
    .string()
    .trim()
    .min(2, 'El medicamento es obligatorio.')
    .max(120, 'Máximo 120 caracteres.'),
  dosis: z
    .string()
    .trim()
    .min(1, 'Indica la dosis prescrita.')
    .max(60, 'Máximo 60 caracteres.'),
  via: z.enum(['IV', 'IM', 'ET', 'VO'], {
    message: 'Selecciona la vía de administración.',
  }),
  hora: z.string().regex(/^\d{2}:\d{2}$/, 'Usa el formato HH:mm.'),
  estado: z.enum(['Pendiente', 'Administrado']).optional(),
});

/** Datos del formulario de prescripción. */
export type PrescripcionFormData = z.infer<typeof prescripcionSchema>;
