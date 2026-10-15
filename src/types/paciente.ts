export interface Paciente {
  id: number
  nombre: string
  fechaNacimiento: string
  sexo: string
  edadGestacional: string
  peso: number
  numeroCuna: string
  fechaIngreso: string
  medicoResponsable: string
  diagnostico: string
  estadoCanula: string
  viaIntravenosa: string
  observaciones?: string
}