export type AlertaSistema = {
  nivel: 'Advertencia' | 'Critica'
  mensaje: string
}

export type AlertaClinica = {
  id: number
  nivel: string
  mensaje: string
  cuna_identificador: string | null
  paciente_nombre: string | null
}

export type ResumenSupervisor = {
  capacidad_total: number
  cunas_ocupadas: number
  cunas_disponibles: number
  porcentaje_ocupacion: number
  ingresos_hoy: number
  ingresos_7_dias: number
  altas_hoy: number
  altas_7_dias: number
  alertas_activas: { total: number; criticas: number; advertencias: number }
  alertas_sistema: AlertaSistema[]
  alertas_clinicas: AlertaClinica[]
}