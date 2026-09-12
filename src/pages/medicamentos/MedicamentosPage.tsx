import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Button from '@/components/ui/Button/Button'
import Table, {
  type TableColumn,
} from '@/components/ui/Table/Table'
import { getMedicamentos } from '@/services/medicamentosService'
import type { Medicamento } from '@/types/medicamento'

import './MedicamentosPage.css'

const PAGE_SIZE = 5

export default function MedicamentosPage() {
  const navigate = useNavigate()

  const [medicamentos, setMedicamentos] = useState<
    Medicamento[]
  >([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
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
  }, [])

  const totalPages = Math.max(
    1,
    Math.ceil(medicamentos.length / PAGE_SIZE)
  )

  const visibleMedicamentos = medicamentos.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  )

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
          onClick={() =>
            navigate(
              `/medicamentos/editar/${medicamento.id}`
            )
          }
        >
          Editar
        </Button>
      ),
    },
  ]

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
  )
}