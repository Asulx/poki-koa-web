import { api } from '@/api/axios'
import type { Medicamento } from '@/types/medicamento'

const MEDICAMENTOS_ENDPOINT = '/medicamentos'

export async function getMedicamentos(): Promise<Medicamento[]> {
  const response = await api.get<Medicamento[]>(
    MEDICAMENTOS_ENDPOINT
  )

  return response.data
}

export async function getMedicamentoPorId(
  id: number
): Promise<Medicamento> {
  const response = await api.get<Medicamento>(
    `${MEDICAMENTOS_ENDPOINT}/${id}`
  )

  return response.data
}

export async function buscarMedicamentosPorPrincipioActivo(
  principioActivo: string
): Promise<Medicamento[]> {
  const response = await api.get<Medicamento[]>(
    MEDICAMENTOS_ENDPOINT,
    {
      params: {
        principioActivo,
      },
    }
  )

  return response.data
}

export async function validarStockMedicamento(
  id: number
): Promise<boolean> {
  const medicamento = await getMedicamentoPorId(id)

  return medicamento.stock > 0
}