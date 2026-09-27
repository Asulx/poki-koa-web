import { api } from '@/api/axios'
import type { Paciente } from '@/types/paciente'

const PACIENTES_ENDPOINT = '/pacientes'

export const pacientesService = {
  async listar(): Promise<Paciente[]> {
    const response = await api.get<Paciente[]>(
      PACIENTES_ENDPOINT
    )

    return response.data
  },

  async obtenerPorId(id: number): Promise<Paciente> {
    const response = await api.get<Paciente>(
      `${PACIENTES_ENDPOINT}/${id}`
    )

    return response.data
  },

  async crear(
    paciente: Omit<Paciente, 'id'>
  ): Promise<Paciente> {
    const response = await api.post<Paciente>(
      PACIENTES_ENDPOINT,
      paciente
    )

    return response.data
  },

  async actualizar(
    id: number,
    paciente: Partial<Omit<Paciente, 'id'>>
  ): Promise<Paciente> {
    const response = await api.put<Paciente>(
      `${PACIENTES_ENDPOINT}/${id}`,
      paciente
    )

    return response.data
  },
}