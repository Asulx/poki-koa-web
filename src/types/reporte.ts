export interface DatosReporte {
  totalAlertas: number
  medicamentosAdministrados: number
  eventosCriticos: number
}

export interface MetricasGenerales {
  totalPacientes: number
  pacientesActivos: number
  totalMedicamentos: number
  medicamentosStockCritico: number
}

export interface EstadisticaPacientes {
  periodo: string
  cantidad: number
}