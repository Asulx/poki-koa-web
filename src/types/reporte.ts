/**
 * @file reporte.ts
 * @description Contratos de métricas y reportes operacionales del dashboard.
 */

/** Resumen completo calculado por `GET /api/reportes/resumen/`. */
export interface ResumenOperacion {
  totalPacientes: number;
  pacientesActivos: number;
  pacientesDadosDeAlta: number;
  totalCunas: number;
  cunasOcupadas: number;
  cunasDisponibles: number;
  cunasMantenimiento: number;
  ocupacionPorcentaje: number;
  totalMedicamentos: number;
  medicamentosPendientes: number;
  medicamentosAdministrados: number;
  medicamentosStockCritico: number;
  alertasActivas: number;
  alertasCriticas: number;
  planesActivos: number;
  personalActivo: number;
  turnosActivos: number;
  asignacionesHoy: number;
  generadoEn: string;
}

/** Punto de la serie temporal diaria. */
export interface PuntoSerie {
  fecha: string;
  ingresos: number;
  alertas: number;
}

/** Respuesta de `GET /api/reportes/serie/`. */
export interface SerieActividad {
  dias: number;
  serie: PuntoSerie[];
}

/** Distribución de cunas por estado. */
export interface DistribucionCunasItem {
  estado: 'ocupada' | 'disponible' | 'mantenimiento';
  cantidad: number;
}

/** Distribución de alertas activas por tipo. */
export interface DistribucionAlertasItem {
  tipo: string;
  etiqueta: string;
  cantidad: number;
}

/** Distribución de prescripciones por estado. */
export interface DistribucionMedicamentosItem {
  estado: string;
  cantidad: number;
}

/** Personal asignado por turno en el día. */
export interface PersonalTurnoItem {
  turno: string;
  cantidad: number;
  horaInicio: string;
  horaFin: string;
}

/** Respuesta de `GET /api/reportes/distribucion/`. */
export interface DistribucionReporte {
  cunas: DistribucionCunasItem[];
  alertas: DistribucionAlertasItem[];
  medicamentos: DistribucionMedicamentosItem[];
  personal: PersonalTurnoItem[];
}
