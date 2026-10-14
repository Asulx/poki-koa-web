
import { api } from '@/api/axios'

export interface Medico {
  id: number
  nombre_completo: string
  turno: string | null
}

export const medicosService = {
  async listar(): Promise<Medico[]> {
    const response = await api.get<Medico[]>('/medicos/')
    return response.data
  },
}
