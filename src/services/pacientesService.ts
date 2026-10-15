import { api } from '@/api/axios'
import type { Paciente } from '@/types/paciente'
import type { PacienteFormData } from '@/forms/schemas/pacienteSchema'

const PACIENTES_ENDPOINT = '/bebes/'

interface BebeApi {
  id: number
  nombre: string
  nombre_completo?: string
  fecha_nacimiento: string
  sexo: string
  edad_gestacional: string
  peso: number
  numero_cuna: string | null
  fecha_ingreso: string
  medico_responsable: string | null
  diagnostico: string
  estado_canula: string | null
  via_intravenosa: string | null
  observaciones?: string
}

interface BebePayload {
  nombre_completo: string
  edad_gestacional: string
  sexo: string
  peso: number
  fecha_nacimiento: string
  fecha_ingreso: string
  diagnostico: string
  observaciones: string
}

function bebeApiAPaciente(bebe: BebeApi): Paciente {
  return {
    id: bebe.id,
    nombre: bebe.nombre ?? bebe.nombre_completo ?? '',
    fechaNacimiento: bebe.fecha_nacimiento,
    sexo: bebe.sexo,
    edadGestacional: bebe.edad_gestacional,
    peso: bebe.peso,
    numeroCuna: bebe.numero_cuna ?? '',
    fechaIngreso: bebe.fecha_ingreso,
    medicoResponsable: bebe.medico_responsable ?? '',
    diagnostico: bebe.diagnostico,
    estadoCanula: bebe.estado_canula ?? '',
    viaIntravenosa: bebe.via_intravenosa ?? '',
    observaciones: bebe.observaciones ?? '',
  }
}

function pacienteAPayload(
  paciente: PacienteFormData
): BebePayload {
  return {
    nombre_completo: paciente.nombre,
    edad_gestacional: paciente.edadGestacional,
    sexo: paciente.sexo,
    peso: paciente.peso,
    fecha_nacimiento: paciente.fechaNacimiento,
    fecha_ingreso: paciente.fechaIngreso,
    diagnostico: paciente.diagnostico,
    observaciones: paciente.observaciones ?? '',
  }
}

export const pacientesService = {
  async listar(): Promise<Paciente[]> {
    const response = await api.get<BebeApi[]>(
      PACIENTES_ENDPOINT
    )

    return response.data.map(bebeApiAPaciente)
  },

  async obtenerPorId(id: number): Promise<Paciente> {
    const response = await api.get<BebeApi>(
      `${PACIENTES_ENDPOINT}${id}/`
    )

    return bebeApiAPaciente(response.data)
  },

  async crear(
    paciente: PacienteFormData
  ): Promise<Paciente> {
    const response = await api.post<BebeApi>(
      PACIENTES_ENDPOINT,
      pacienteAPayload(paciente)
    )

    return bebeApiAPaciente(response.data)
  },

  async actualizar(
    id: number,
    paciente: PacienteFormData
  ): Promise<Paciente> {
    const response = await api.patch<BebeApi>(
      `${PACIENTES_ENDPOINT}${id}/`,
      pacienteAPayload(paciente)
    )

    return bebeApiAPaciente(response.data)
  },
}