/**
 * @file reporte.ts
 * @description Definición de contratos de tipo e interfaces para la gestión de reportes,
 * métricas generales y estadísticas demográficas o temporales de los pacientes.
 */

export interface DatosReporte {
  totalAlertas: number;
  medicamentosAdministrados: number;
  eventosCriticos: number;
}

export interface MetricasGenerales {
  totalPacientes: number;
  pacientesActivos: number;
  totalMedicamentos: number;
  medicamentosStockCritico: number;
}

export interface EstadisticaPacientes {
  periodo: string;
  cantidad: number;
}