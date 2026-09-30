import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import PacienteForm from '@/components/pacientes/PacienteForm'
import Table, { type TableColumn } from '@/components/ui/Table/Table'
import Button from '@/components/ui/Button/Button'
import { pacientesService } from '@/services/pacientesService'
import type { Paciente, PacientePayload } from '@/types/paciente'

export default function PacientesPage() {
  const navigate = useNavigate()

  // Pestaña activa: 'lista' o 'nuevo'
  const [tabActiva, setTabActiva] = useState<'lista' | 'nuevo'>('lista')

  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [cargando, setCargando] = useState(true)
  const [errorCarga, setErrorCarga] = useState<string | null>(null)
  const [guardando, setGuardando] = useState(false)

  // Filtros
  const [filtroTexto, setFiltroTexto] = useState('')
  const [filtroSexo, setFiltroSexo] = useState('')

  // Cargar pacientes
  const cargarPacientes = async () => {
    setCargando(true)
    setErrorCarga(null)
    try {
      const data = await pacientesService.listar()
      setPacientes(Array.isArray(data) ? data : [])
    } catch (err: any) {
      console.warn('Error al cargar pacientes del backend:', err)
      setErrorCarga(
        'No se pudieron cargar los pacientes desde api/bebes/. Asegúrese de que el servidor backend esté iniciado.'
      )
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarPacientes()
  }, [])

  // Guardar nuevo paciente desde la pestaña de registro
  const handleGuardarPaciente = async (datos: PacientePayload) => {
    setGuardando(true)
    try {
      const creado = await pacientesService.crear(datos)
      alert(`¡Paciente "${creado.nombre_completo}" registrado con éxito en api/bebes/!`)
      setTabActiva('lista')
      await cargarPacientes()
    } catch (error: any) {
      console.error('Error al registrar paciente:', error)
      let detalle = 'No fue posible registrar el paciente en el backend.'
      if (error.response?.data) {
        if (typeof error.response.data === 'object') {
          detalle = Object.entries(error.response.data)
            .map(([campo, msgs]) => `${campo}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
            .join(' | ')
        } else if (typeof error.response.data === 'string') {
          detalle = error.response.data
        }
      }
      alert(`Error al guardar: ${detalle}`)
    } finally {
      setGuardando(false)
    }
  }

  // Eliminar paciente
  const handleEliminar = async (id: number, nombre: string) => {
    if (!window.confirm(`¿Está seguro de eliminar el registro de "${nombre}"?`)) {
      return
    }
    try {
      await pacientesService.eliminar(id)
      alert(`Registro de "${nombre}" eliminado.`)
      await cargarPacientes()
    } catch (err) {
      console.error('Error al eliminar paciente:', err)
      alert('No se pudo eliminar el paciente.')
    }
  }

  // Filtrado
  const pacientesFiltrados = useMemo(() => {
    return pacientes.filter((p) => {
      const coincideTexto =
        filtroTexto === '' ||
        p.nombre_completo.toLowerCase().includes(filtroTexto.toLowerCase()) ||
        String(p.id).includes(filtroTexto) ||
        (p.diagnostico && p.diagnostico.toLowerCase().includes(filtroTexto.toLowerCase()))

      const coincideSexo =
        filtroSexo === '' ||
        p.sexo === filtroSexo ||
        (filtroSexo === 'F' && p.sexo === 'Femenino') ||
        (filtroSexo === 'M' && p.sexo === 'Masculino')

      return coincideTexto && coincideSexo
    })
  }, [pacientes, filtroTexto, filtroSexo])

  // Columnas para la tabla
  const columns: TableColumn<Paciente>[] = [
    {
      key: 'id',
      label: 'ID',
      render: (row) => <strong>#{row.id}</strong>,
    },
    {
      key: 'nombre_completo',
      label: 'Nombre Completo',
      render: (row) => (
        <div>
          <span style={{ fontWeight: 600, color: '#1f5b6a' }}>
            {row.nombre_completo}
          </span>
          {row.cuna_identificador && (
            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
              Cuna: {row.cuna_identificador}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'edad_meses',
      label: 'Edad (Meses)',
      render: (row) =>
        row.edad_meses !== null && row.edad_meses !== undefined
          ? `${row.edad_meses} m`
          : '-',
    },
    {
      key: 'sexo',
      label: 'Sexo',
      render: (row) => {
        if (row.sexo === 'F' || row.sexo === 'Femenino') return 'Femenino'
        if (row.sexo === 'M' || row.sexo === 'Masculino') return 'Masculino'
        return '-'
      },
    },
    {
      key: 'peso',
      label: 'Peso',
      render: (row) => (row.peso ? `${row.peso} kg` : '-'),
    },
    {
      key: 'diagnostico',
      label: 'Diagnóstico',
      render: (row) => row.diagnostico || 'Sin diagnóstico registrado',
    },
    {
      key: 'medico_a_cargo',
      label: 'Médico a Cargo',
      render: (row) => row.medico_nombre || (row.medico_a_cargo ? `Médico #${row.medico_a_cargo}` : 'No asignado'),
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (row) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => navigate(`/pacientes/editar/${row.id}`)}
            style={{
              padding: '0.35rem 0.75rem',
              backgroundColor: '#1f5b6a',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: 500,
            }}
          >
            Editar
          </button>
          <button
            onClick={() => handleEliminar(row.id, row.nombre_completo)}
            style={{
              padding: '0.35rem 0.75rem',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: 500,
            }}
          >
            Eliminar
          </button>
        </div>
      ),
    },
  ]

  return (
    <div style={{ padding: '1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* HEADER */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 'bold', color: '#1f5b6a' }}>
            Módulo de Pacientes
          </h1>
          <p style={{ margin: 0, color: '#6b7280', fontSize: '0.95rem' }}>
            Control y gestión de recién nacidos en la unidad neonatal (conectado a api/bebes/)
          </p>
        </div>

        {/* SELECTOR DE PESTAÑAS */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setTabActiva('lista')}
            style={{
              padding: '0.6rem 1.2rem',
              borderRadius: '6px',
              border: '1px solid #1f5b6a',
              backgroundColor: tabActiva === 'lista' ? '#1f5b6a' : 'white',
              color: tabActiva === 'lista' ? 'white' : '#1f5b6a',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Lista de Pacientes ({pacientes.length})
          </button>

          <button
            onClick={() => setTabActiva('nuevo')}
            style={{
              padding: '0.6rem 1.2rem',
              borderRadius: '6px',
              border: '1px solid #1f5b6a',
              backgroundColor: tabActiva === 'nuevo' ? '#1f5b6a' : 'white',
              color: tabActiva === 'nuevo' ? 'white' : '#1f5b6a',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            + Agregar Bebé
          </button>
        </div>
      </header>

      {/* CONTENIDO PESTAÑA: AGREGAR BEBÉ */}
      {tabActiva === 'nuevo' && (
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
            }}
          >
            <h2 style={{ fontSize: '1.3rem', color: '#374151', margin: 0 }}>
              Formulario de Ingreso de Paciente
            </h2>
            <Button variant="secondary" onClick={() => setTabActiva('lista')}>
              Ver Lista
            </Button>
          </div>
          <PacienteForm
            onSubmit={handleGuardarPaciente}
            isLoading={guardando}
            onCancel={() => setTabActiva('lista')}
          />
        </div>
      )}

      {/* CONTENIDO PESTAÑA: LISTADO DE PACIENTES */}
      {tabActiva === 'lista' && (
        <div>
          {/* BARRA DE FILTROS Y BÚSQUEDA */}
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              alignItems: 'center',
              marginBottom: '1.5rem',
              backgroundColor: 'white',
              padding: '1rem',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ flex: '1', minWidth: '200px' }}>
              <input
                type="text"
                placeholder="Buscar por nombre, ID o diagnóstico..."
                value={filtroTexto}
                onChange={(e) => setFiltroTexto(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.8rem',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                  fontSize: '0.9rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <select
                value={filtroSexo}
                onChange={(e) => setFiltroSexo(e.target.value)}
                style={{
                  padding: '0.6rem 0.8rem',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                  fontSize: '0.9rem',
                }}
              >
                <option value="">Todos los sexos</option>
                <option value="F">Femenino</option>
                <option value="M">Masculino</option>
              </select>
            </div>

            {(filtroTexto || filtroSexo) && (
              <button
                onClick={() => {
                  setFiltroTexto('')
                  setFiltroSexo('')
                }}
                style={{
                  padding: '0.6rem 1rem',
                  backgroundColor: '#f3f4f6',
                  color: '#4b5563',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                }}
              >
                Limpiar filtros
              </button>
            )}

            <button
              onClick={cargarPacientes}
              disabled={cargando}
              style={{
                padding: '0.6rem 1rem',
                backgroundColor: '#f9fafb',
                color: '#1f5b6a',
                border: '1px solid #1f5b6a',
                borderRadius: '6px',
                cursor: cargando ? 'not-allowed' : 'pointer',
                fontSize: '0.85rem',
                fontWeight: 600,
              }}
            >
              {cargando ? 'Actualizando...' : 'Recargar'}
            </button>
          </div>

          {/* MENSAJE DE ADVERTENCIA / ERROR DE CONEXIÓN */}
          {errorCarga && (
            <div
              style={{
                backgroundColor: '#fffbeb',
                border: '1px solid #fef3c7',
                color: '#92400e',
                padding: '1rem',
                borderRadius: '6px',
                marginBottom: '1rem',
                fontSize: '0.9rem',
              }}
            >
              <strong>Aviso de conexión:</strong> {errorCarga}
            </div>
          )}

          {/* TABLA DE RESULTADOS */}
          {cargando ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
              Cargando lista de bebés desde el backend...
            </div>
          ) : pacientes.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '3rem',
                backgroundColor: 'white',
                borderRadius: '8px',
                border: '1px dashed #d1d5db',
              }}
            >
              <h3 style={{ color: '#4b5563', margin: '0 0 0.5rem 0' }}>
                No hay bebés registrados actualmente
              </h3>
              <p style={{ color: '#9ca3af', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                Comience dando de alta a un recién nacido en el sistema para asignarle una cuna y seguimiento.
              </p>
              <button
                onClick={() => setTabActiva('nuevo')}
                style={{
                  padding: '0.7rem 1.5rem',
                  backgroundColor: '#1f5b6a',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                + Registrar Primer Bebé
              </button>
            </div>
          ) : pacientesFiltrados.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: 'white', borderRadius: '8px' }}>
              <p style={{ color: '#6b7280' }}>
                No se encontraron pacientes que coincidan con los filtros aplicados.
              </p>
            </div>
          ) : (
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                overflow: 'hidden',
              }}
            >
              <Table
                columns={columns}
                data={pacientesFiltrados}
                rowKey={(p) => p.id}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}