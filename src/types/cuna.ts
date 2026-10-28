/**
 * @file cuna.ts
 * @description Definición de contratos de tipo e interfaces para la gestión de cunas
 * y su estado operativo dentro de la unidad neonatal.
 */

export type EstadoCuna = 'disponible' | 'ocupada' | 'mantenimiento';

export interface Cuna {
  id: string;
  numero: number;
  estado: EstadoCuna;
  pacienteId?: string;
  pacienteNombre?: string;
  alertaMedica?: boolean;
}
