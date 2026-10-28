/**
 * @file medicamentosService.ts
 * @description Servicio encargado de la gestión de medicamentos en el sistema.
 * Proporciona funciones asíncronas para consultar el catálogo general, buscar por ID o principio activo,
 * y validar la disponibilidad de stock clínico utilizando el cliente HTTP configurado.
 */

import { api } from '@/api/axios';
import type { Medicamento } from '@/types/medicamento';

const MEDICAMENTOS_ENDPOINT = '/medicamentos';

/**
 * Obtiene el listado completo de medicamentos registrados en el sistema.
 *
 * @returns Una promesa que resuelve con un arreglo de objetos de tipo {@link Medicamento}.
 */
export async function getMedicamentos(): Promise<Medicamento[]> {
  const response = await api.get<Medicamento[]>(MEDICAMENTOS_ENDPOINT);

  return response.data;
}

/**
 * Obtiene los detalles de un medicamento específico a partir de su identificador único.
 *
 * @param id - Identificador numérico único del medicamento.
 * @returns Una promesa que resuelve con el objeto {@link Medicamento} correspondiente.
 */
export async function getMedicamentoPorId(id: number): Promise<Medicamento> {
  const response = await api.get<Medicamento>(`${MEDICAMENTOS_ENDPOINT}/${id}`);

  return response.data;
}

/**
 * Busca y filtra medicamentos según su principio activo.
 *
 * @param principioActivo - Cadena de texto con el principio activo o nombre genérico a buscar.
 * @returns Una promesa que resuelve con un arreglo de medicamentos que coinciden con el criterio.
 */
export async function buscarMedicamentosPorPrincipioActivo(
  principioActivo: string
): Promise<Medicamento[]> {
  const response = await api.get<Medicamento[]>(MEDICAMENTOS_ENDPOINT, {
    params: {
      principioActivo,
    },
  });

  return response.data;
}

/**
 * Valida si un medicamento cuenta con stock disponible superior a cero para su dispensación.
 *
 * @param id - Identificador numérico único del medicamento a verificar.
 * @returns Una promesa que resuelve con `true` si hay stock disponible, o `false` en caso contrario.
 */
export async function validarStockMedicamento(id: number): Promise<boolean> {
  const medicamento = await getMedicamentoPorId(id);

  return medicamento.stock > 0;
}
