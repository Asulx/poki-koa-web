
import { api } from '@/api/axios'

import type { Paciente } from '@/types/paciente'
import type { PacienteFormData } from '@/forms/schemas/pacienteSchema'

import { convertirPacienteParaDjango } from './pacienteMapper'

// Estructura que devuelve Django
interface BebeAPI {
  id: number
  identificador: string
  nombre_completo: string
  fecha_nacimiento: string | null
  sexo: 'F' | 'M'
  edad_gestacional: string | number | null
  peso: number | null
  fecha_ingreso: string
  medico_a_cargo: number | null
  medico_responsable: string | null
  diagnostico: string | null
  observaciones: string | null
  numero_cuna: string | null
  estado_canula: boolean | null
  via_intravenosa: boolean | null
}

const PACIENTES_ENDPOINT = '/bebes/'

const pacientePorId = (id: number) =>
  `${PACIENTES_ENDPOINT}${id}/`

// Convertir los datos de Django al formato React
function convertirBebeAPaciente(bebe: BebeAPI): Paciente {
  return {
    id: bebe.id,
    identificador: bebe.identificador,
    nombre: bebe.nombre_completo,

    fechaNacimiento: bebe.fecha_nacimiento ?? '',

    sexo:
      bebe.sexo === 'F'
        ? 'Femenino'
        : 'Masculino',

    edadGestacional:
      bebe.edad_gestacional != null
        ? String(bebe.edad_gestacional)
        : '',

    peso: bebe.peso ?? 0,

    numeroCuna: bebe.numero_cuna ?? '',

    fechaIngreso: bebe.fecha_ingreso
      ? bebe.fecha_ingreso.slice(0, 10)
      : '',

    // El formulario necesita el ID del médico.
    medicoResponsable:
      bebe.medico_a_cargo != null
        ? String(bebe.medico_a_cargo)
        : '',

    diagnostico: bebe.diagnostico ?? '',

    estadoCanula:
      bebe.estado_canula === true
        ? 'OK'
        : bebe.estado_canula === false
          ? 'Pendiente'
          : '',

    viaIntravenosa:
      bebe.via_intravenosa === true
        ? 'Activa'
        : bebe.via_intravenosa === false
          ? 'Inactiva'
          : '',

    observaciones: bebe.observaciones ?? '',
  }
}

export const pacientesService = {
  // Obtener todos los pacientes
  async listar(): Promise<Paciente[]> {
    const response = await api.get<BebeAPI[]>(
      PACIENTES_ENDPOINT
    )

    return response.data.map(convertirBebeAPaciente)
  },

  // Obtener un paciente por su ID
  async obtenerPorId(id: number): Promise<Paciente> {
    const response = await api.get<BebeAPI>(
      pacientePorId(id)
    )

    return convertirBebeAPaciente(response.data)
  },

  // Registrar un paciente
  async crear(data: PacienteFormData): Promise<Paciente> {
    const medicoId = Number(data.medicoResponsable)

    const payload = convertirPacienteParaDjango(
      data,
      medicoId
    )

    const response = await api.post<BebeAPI>(
      PACIENTES_ENDPOINT,
      payload
    )

    return convertirBebeAPaciente(response.data)
  },

  // Actualizar un paciente existente
  async actualizar(
    id: number,
    data: PacienteFormData
  ): Promise<Paciente> {
    const medicoId = Number(data.medicoResponsable)

    const payload = convertirPacienteParaDjango(
      data,
      medicoId
    )

    const response = await api.put<BebeAPI>(
      pacientePorId(id),
      payload
    )

    return convertirBebeAPaciente(response.data)
  },
}
