import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import PacientesFiltros from '@/components/pacientes/PacientesFiltros/PacientesFiltros'
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

  const [busqueda, setBusqueda] = useState('')
  const [sexo, setSexo] = useState('')
  const [fechaIngreso, setFechaIngreso] = useState('')
  const [estadoCanula, setEstadoCanula] = useState('')

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

  const pacientesFiltrados = pacientes.filter(
    (paciente) => {
      const textoBusqueda = busqueda
        .trim()
        .toLowerCase()

      const coincideBusqueda =
        textoBusqueda === '' ||
        paciente.nombre
          .toLowerCase()
          .includes(textoBusqueda) ||
        String(paciente.id).includes(textoBusqueda)

      const coincideSexo =
        sexo === '' || paciente.sexo === sexo

      const coincideFechaIngreso =
        fechaIngreso === '' ||
        paciente.fechaIngreso === fechaIngreso

      const coincideEstadoCanula =
        estadoCanula === '' ||
        paciente.estadoCanula === estadoCanula

      return (
        coincideBusqueda &&
        coincideSexo &&
        coincideFechaIngreso &&
        coincideEstadoCanula
      )
    }
  )

  const totalPages = Math.max(
    1,
    Math.ceil(
      pacientesFiltrados.length / ITEMS_PER_PAGE
    )
  )

  const startIndex =
    (currentPage - 1) * ITEMS_PER_PAGE

  const pacientesPaginados =
    pacientesFiltrados.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    )

  function actualizarBusqueda(value: string) {
    setBusqueda(value)
    setCurrentPage(1)
  }

  function actualizarSexo(value: string) {
    setSexo(value)
    setCurrentPage(1)
  }

  function actualizarFechaIngreso(value: string) {
    setFechaIngreso(value)
    setCurrentPage(1)
  }

  function actualizarEstadoCanula(value: string) {
    setEstadoCanula(value)
    setCurrentPage(1)
  }

  function limpiarFiltros() {
    setBusqueda('')
    setSexo('')
    setFechaIngreso('')
    setEstadoCanula('')
    setCurrentPage(1)
  }

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

      <PacientesFiltros
        busqueda={busqueda}
        sexo={sexo}
        fechaIngreso={fechaIngreso}
        estadoCanula={estadoCanula}
        onBusquedaChange={actualizarBusqueda}
        onSexoChange={actualizarSexo}
        onFechaIngresoChange={
          actualizarFechaIngreso
        }
        onEstadoCanulaChange={
          actualizarEstadoCanula
        }
        onLimpiar={limpiarFiltros}
      />

      {pacientes.length === 0 ? (
        <p>No hay pacientes registrados.</p>
      ) : pacientesFiltrados.length === 0 ? (
        <div>
          <p>
            No se encontraron pacientes con los
            criterios seleccionados.
          </p>

          <Button onClick={limpiarFiltros}>
            Limpiar filtros
          </Button>
        </div>
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