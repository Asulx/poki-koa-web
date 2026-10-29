/**
 * @file medicamento.ts
 * @description Contratos de prescripciones (`Medicamento`) y del inventario
 * farmacéutico (`MedicamentoCatalogo`). Son entidades distintas: no mezclar.
 */

/** Vías de administración admitidas por el backend. */
export type ViaAdministracion = 'IV' | 'IM' | 'ET' | 'VO';

/** Estado de administración de una prescripción. */
export type EstadoPrescripcion = 'Administrado' | 'Pendiente';

/** Prescripción de un fármaco a un paciente. */
export interface Medicamento {
  id: number;
  pacienteId: number;
  pacienteNombre: string;
  cuna: string;
  nombre: string;
  dosis: string;
  via: ViaAdministracion;
  hora: string;
  estado: EstadoPrescripcion;
}

/** Payload para crear una prescripción. */
export interface MedicamentoPayload {
  paciente: number;
  nombre: string;
  dosis: string;
  via: ViaAdministracion;
  hora: string;
  estado?: EstadoPrescripcion;
}

/** Producto del catálogo de inventario. */
export interface MedicamentoCatalogo {
  id: number;
  nombre: string;
  principioActivo: string;
  dosisMg: number;
  stock: number;
}

/** Payload para crear/actualizar un producto del catálogo. */
export interface CatalogoPayload {
  nombre: string;
  principioActivo: string;
  dosisMg: number;
  stock: number;
}

/** Filtros del catálogo. */
export interface FiltrosCatalogo {
  search?: string;
  stockBajo?: boolean;
}
