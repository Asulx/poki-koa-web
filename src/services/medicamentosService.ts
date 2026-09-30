import { medicamentosMock } from '@/mocks/medicamentosMock'
import type { Medicamento } from '@/types/medicamento'

const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms))

export async function getMedicamentos(): Promise<Medicamento[]> {
  await delay(1000)
  return [...medicamentosMock]
}