/**
 * @file registro.ts
 * @description Contratos de la bitácora de auditoría (solo lectura).
 */

/** Acciones auditadas por el backend. */
export type AccionAuditoria =
  | 'crear'
  | 'actualizar'
  | 'eliminar'
  | 'asignar'
  | 'liberar'
  | 'alta'
  | 'administrar'
  | 'resolver'
  | 'login'
  | 'logout';

/** Registro individual de la bitácora. */
export interface RegistroActividad {
  id: number;
  usuarioId: number | null;
  usuarioNombre: string;
  accion: AccionAuditoria;
  accionDisplay: string;
  entidad: string;
  entidadId: string | null;
  descripcion: string;
  metadata: Record<string, unknown>;
  ipAddress: string | null;
  creadoEn: string;
}

/** Conteo de registros agrupado por acción. */
export interface ResumenAuditoria {
  accion: AccionAuditoria;
  total: number;
}

/** Filtros de la bitácora. */
export interface FiltrosAuditoria {
  accion?: string;
  entidad?: string;
  usuarioId?: number;
  desde?: string;
  hasta?: string;
  search?: string;
}
