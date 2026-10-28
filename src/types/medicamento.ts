/**
 * @file medicamento.ts
 * @description Definición de contratos de tipo e interfaces para la gestión de medicamentos
 * y su inventario dentro de la unidad neonatal.
 */

export interface Medicamento {
  id: number;
  nombre: string;
  principioActivo: string;
  dosis: string;
  stock: number;
}