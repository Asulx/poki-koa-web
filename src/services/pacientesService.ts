import { api } from '@/api/axios'
import type { Paciente, PacientePayload, Medico } from '@/types/paciente'

const BEBES_ENDPOINT = '/bebes/'
const MEDICOS_ENDPOINT = '/medicos/'

export const pacientesService = {
  /**
   * Obtiene la lista de todos los bebés registrados en la unidad.
   */
  async listar(): Promise<Paciente[]> {
    const response = await api.get<Paciente[]>(BEBES_ENDPOINT)
    return response.data
  },

  /**
   * Obtiene el detalle de un bebé por su identificador.
   */
  async obtenerPorId(id: number): Promise<Paciente> {
    const response = await api.get<Paciente>(`${BEBES_ENDPOINT}${id}/`)
    return response.data
  },

  /**
   * Registra un nuevo bebé en la base de datos enviando los parámetros requeridos.
   */
  async crear(paciente: PacientePayload): Promise<Paciente> {
    const response = await api.post<Paciente>(BEBES_ENDPOINT, paciente)
    return response.data
  },

  /**
   * Actualiza los datos de un bebé existente.
   */
  async actualizar(
    id: number,
    paciente: Partial<PacientePayload>
  ): Promise<Paciente> {
    const response = await api.put<Paciente>(
      `${BEBES_ENDPOINT}${id}/`,
      paciente
    )
    return response.data
  },

  /**
   * Elimina el registro de un bebé.
   */
  async eliminar(id: number): Promise<void> {
    await api.delete(`${BEBES_ENDPOINT}${id}/`)
  },

  /**
   * Obtiene la lista de médicos disponibles para asignar al bebé.
   */
  async listarMedicos(): Promise<Medico[]> {
    try {
      const response = await api.get<Medico[]>(MEDICOS_ENDPOINT)
      return response.data
    } catch (error) {
      console.warn('No se pudieron cargar los médicos:', error)
      return []
    }
  },
}
