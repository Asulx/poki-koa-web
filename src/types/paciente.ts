export interface Paciente {
  id: number
  nombre_completo: string
  edad_meses: number | null
  sexo: string | null
  peso: number | null
  fecha_nacimiento: string | null
  fecha_ingreso: string | null
  diagnostico: string
  plan_cuidados: string
  medico_a_cargo: number | null

  // Campos calculados y anidados que devuelve el backend (BebeSerializer)
  medico_nombre?: string | null
  cuna_identificador?: string | null
  signos_vitales?: {
    ritmo_cardiaco?: number | null
    spo2?: number | null
    temperatura?: number | null
  } | null
  medicamentos?: Array<{
    id: number
    nombre: string
    dosis: string
    via: string
    hora: string
    estado: string
    paciente_nombre?: string
    cuna?: string
  }>
  alertas?: Array<{
    id: number
    tipo: string
    mensaje: string
    nivel: string
    fecha_hora: string
    activa: boolean
    valor_leido?: number | null
    paciente_nombre?: string
    cuna_identificador?: string
  }>
}

export type PacientePayload = {
  nombre_completo: string
  edad_meses: number | null
  sexo: string | null
  peso: number | null
  fecha_nacimiento: string | null
  fecha_ingreso: string | null
  diagnostico: string
  plan_cuidados: string
  medico_a_cargo: number | null
}

export interface Medico {
  id: number
  nombre_completo: string
  turno?: string | null
}
