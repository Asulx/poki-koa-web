
export interface Paciente {
  id: number
  identificador: string
  nombre: string
  fechaNacimiento: string
  sexo: 'Masculino' | 'Femenino'
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
