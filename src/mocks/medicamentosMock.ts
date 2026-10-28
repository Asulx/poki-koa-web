import type { Medicamento } from '@/types/medicamento';

/**
 * Arreglo de datos simulados (*mock data*) que representa un catálogo inicial
 * de medicamentos disponibles para el sistema de gestión farmacéutica.
 */
export const medicamentosMock: Medicamento[] = [
  {
    id: 1,
    nombre: 'Paracetamol',
    principioActivo: 'Paracetamol',
    dosis: '500 mg',
    stock: 120,
  },
  {
    id: 2,
    nombre: 'Ibuprofeno',
    principioActivo: 'Ibuprofeno',
    dosis: '400 mg',
    stock: 80,
  },
  {
    id: 3,
    nombre: 'Amoxicilina',
    principioActivo: 'Amoxicilina',
    dosis: '250 mg',
    stock: 45,
  },
];
