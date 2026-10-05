import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Button from '@/components/ui/Button/Button'
import Table, {
  type TableColumn,
} from '@/components/ui/Table/Table'

import { pacientesService } from '@/services/pacientesService'
import type { Paciente } from '@/types/paciente'

const ITEMS_PER_PAGE = 5

export default function PacientesPage() {
  const navigate = useNavigate()

  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    async function cargarPacientes() {
      try {
        setIsLoading(true)
        setError(null)

        const data = await pacientesService.listar()

        setPacientes(data)
      } catch (error) {
        console.error(
          'Error al cargar pacientes:',
          error
        )

        setError(
          'No fue posible cargar los pacientes.'
        )
      } finally {
        setIsLoading(false)
      }
    }

    cargarPacientes()
  }, [])

  const totalPages = Math.max(
    1,
    Math.ceil(pacientes.length / ITEMS_PER_PAGE)
  )

  const startIndex =
    (currentPage - 1) * ITEMS_PER_PAGE

  const pacientesPaginados = pacientes.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  )

  const columns: TableColumn<Paciente>[] = [
    {
      key: 'nombre',
      label: 'Nombre',
    },
    {
      key: 'fechaNacimiento',
      label: 'Fecha de nacimiento',
    },
    {
      key: 'numeroCuna',
      label: 'Cuna',
    },
    {
      key: 'medicoResponsable',
      label: 'Médico responsable',
    },
    {
      key: 'diagnostico',
      label: 'Diagnóstico',
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (paciente) => (
        <Button
          onClick={() =>
            navigate(
              `/pacientes/editar/${paciente.id}`
            )
          }
        >
          Editar
        </Button>
      ),
    },
  ]

  if (isLoading) {
    return (
      <div>
        <h1>Pacientes</h1>

        <p>Cargando pacientes...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <h1>Pacientes</h1>

        <p>{error}</p>
      </div>
    )
  }

  return (
    <div>
      <div>
        <h1>Pacientes</h1>

        <Button
          onClick={() =>
            navigate('/pacientes/nuevo')
          }
        >
          Registrar paciente
        </Button>
      </div>

      {pacientes.length === 0 ? (
        <p>No hay pacientes registrados.</p>
      ) : (
        <>
          <div className="table-container">
            <Table
              columns={columns}
              data={pacientesPaginados}
              rowKey={(paciente) => paciente.id}
            />
          </div>

          <div>
            <Button
              disabled={currentPage === 1}
              onClick={() =>
                setCurrentPage(
                  (page) => page - 1
                )
              }
            >
              Anterior
            </Button>

            <span>
              {' '}
              Página {currentPage} de {totalPages}{' '}
            </span>

            <Button
              disabled={
                currentPage === totalPages
              }
              onClick={() =>
                setCurrentPage(
                  (page) => page + 1
                )
              }
            >
              Siguiente
            </Button>
          </div>
        </>
      )}
    </div>
  )
}