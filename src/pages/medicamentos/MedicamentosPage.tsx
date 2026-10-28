import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '@/components/ui/Button/Button';
import Table, { type TableColumn } from '@/components/ui/Table/Table';
import { getMedicamentos } from '@/services/medicamentosService';
import type { Medicamento } from '@/types/medicamento';

import './MedicamentosPage.css';

/** Número máximo de elementos por página en la tabla de medicamentos. */
const PAGE_SIZE = 5;

/** Lista simulada (mock data) de respaldo para el desarrollo e interfaz de medicamentos. */
const mockMedicamentos = [
  {
    id: '1',
    nombre: 'Paracetamol',
    principioActivo: 'Paracetamol',
    dosis: '500mg',
    stock: 120,
  },
  {
    id: '2',
    nombre: 'Ibuprofeno',
    principioActivo: 'Ibuprofeno',
    dosis: '400mg',
    stock: 50,
  },
  {
    id: '3',
    nombre: 'Amoxicilina',
    principioActivo: 'Amoxicilina',
    dosis: '250mg',
    stock: 15,
  },
  {
    id: '4',
    nombre: 'Loratadina',
    principioActivo: 'Loratadina',
    dosis: '10mg',
    stock: 200,
  },
  {
    id: '5',
    nombre: 'Omeprazol',
    principioActivo: 'Omeprazol',
    dosis: '20mg',
    stock: 80,
  },
  {
    id: '6',
    nombre: 'Diclofenaco',
    principioActivo: 'Diclofenaco',
    dosis: '50mg',
    stock: 10,
  },
] as unknown as Medicamento[];

/**
 * Componente de página para el listado, paginación y gestión general de medicamentos.
 * Permite visualizar el inventario farmacéutico en formato tabular con opciones de navegación y edición.
 * 
 * @returns Un elemento JSX con la vista completa del catálogo de medicamentos.
 */
export default function MedicamentosPage() {
  const navigate = useNavigate();

  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    // 2. Comentamos la llamada real a la API
    /*
    getMedicamentos()
      .then((data) => {
        setMedicamentos(data)
      })
      .catch(() => {
        setError('No se pudieron cargar los medicamentos')
      })
      .finally(() => {
        setLoading(false)
      })
    */

    // 3. Inyectamos los datos falsos inmediatamente
    setMedicamentos(mockMedicamentos);
    setLoading(false);
  }, []);

  const totalPages = Math.max(1, Math.ceil(medicamentos.length / PAGE_SIZE));

  const visibleMedicamentos = medicamentos.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const columns: TableColumn<Medicamento>[] = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'principioActivo', label: 'Principio activo' },
    { key: 'dosis', label: 'Dosis' },
    { key: 'stock', label: 'Stock' },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (medicamento) => (
        <Button
          variant="secondary"
          onClick={() => navigate(`/medicamentos/editar/${medicamento.id}`)}
        >
          Editar
        </Button>
      ),
    },
  ];

  return (
    <div>
      <h1>Listado de Medicamentos</h1>

      {loading ? (
        <p>Cargando medicamentos...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <Table
            columns={columns}
            data={visibleMedicamentos}
            rowKey={(medicamento) => medicamento.id}
          />

          <div className="pagination">
            <Button
              variant="secondary"
              disabled={page <= 1}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Anterior
            </Button>

            <span>
              Página {page} de {totalPages}
            </span>

            <Button
              variant="secondary"
              disabled={page >= totalPages}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Siguiente
            </Button>
          </div>
        </>
      )}
    </div>
  );
}