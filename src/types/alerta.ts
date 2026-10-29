/**
 * @file alerta.ts
 * @description Contratos de las alertas clínicas generadas por el motor de
 * signos vitales.
 */

/** Severidad de una alerta. */
export type NivelAlerta = 'Info' | 'Advertencia' | 'Critica';

/** Tipos de evento monitorizado. */
export type TipoAlerta =
  'ritmo_cardiaco' | 'spo2' | 'temperatura' | 'canula' | 'otra';

/** Alerta clínica registrada en el historial del paciente/cuna. */
export interface Alerta {
  id: number;
  pacienteId: number | null;
  pacienteNombre: string | null;
  cunaId: number | null;
  cunaIdentificador: string | null;
  tipo: TipoAlerta;
  tipoDisplay: string;
  nivel: NivelAlerta;
  nivelDisplay: string;
  mensaje: string;
  fechaHora: string;
  activa: boolean;
  valorLeido: number | null;
}

/** Filtros aceptados por `GET /api/alertas/`. */
export interface FiltrosAlertas {
  activa?: boolean;
  nivel?: NivelAlerta;
  tipo?: TipoAlerta;
  pacienteId?: number;
  cunaId?: number;
}

/** Notificación derivada de una alerta para la barra superior. */
export interface Notificacion {
  id: string;
  titulo: string;
  detalle: string;
  fechaHora: string;
  critica: boolean;
  leida: boolean;
  ruta: string;
}
