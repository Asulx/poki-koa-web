import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PacienteForm from '@/components/pacientes/PacienteForm'
import { pacientesService } from '@/services/pacientesService'
import type { Paciente, PacientePayload } from '@/types/paciente'

export default function PacienteEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [paciente, setPaciente] = useState<Paciente | null>(null)
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    async function cargarDatosPaciente() {
      if (!id) {
        // Si no hay id en la url, usamos un paciente de prueba
        setPaciente({
          id: 1,
          nombre_completo: 'Matías González',
          edad_meses: 2,
          sexo: 'M',
          peso: 3.2,
          fecha_nacimiento: '2026-07-15',
          fecha_ingreso: '2026-09-05',
          diagnostico: 'Prematuro tardío estable',
          plan_cuidados: 'Control de saturación y signos cada 4 horas',
          medico_a_cargo: null,
        })
        setCargando(false)
        return
      }

      const pacienteId = Number(id)
      if (isNaN(pacienteId)) {
        setErrorMsg('El ID del paciente no es válido.')
        setCargando(false)
        return
      }

      try {
        setCargando(true)
        setErrorMsg(null)
        const data = await pacientesService.obtenerPorId(pacienteId)
        setPaciente(data)
      } catch (err: any) {
        console.error('Error al cargar paciente:', err)
        setErrorMsg('No se pudo encontrar o cargar la información del paciente.')
      } finally {
        setCargando(false)
      }
    }

    cargarDatosPaciente()
  }, [id])

  const handleUpdate = async (datos: PacientePayload) => {
    const pacienteId = id ? Number(id) : paciente?.id
    if (!pacienteId) {
      alert('No se puede actualizar sin un ID de paciente válido.')
      return
    }

    setGuardando(true)
    setErrorMsg(null)
    try {
      await pacientesService.actualizar(pacienteId, datos)
      alert(`¡Paciente "${datos.nombre_completo}" actualizado con éxito!`)
      navigate('/pacientes')
    } catch (err: any) {
      console.error('Error al actualizar paciente:', err)
      let detalle = 'No se pudo actualizar el paciente. Verifique los datos ingresados.'
      if (err.response?.data) {
        if (typeof err.response.data === 'object') {
          detalle = Object.entries(err.response.data)
            .map(([campo, msgs]) => `${campo}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
            .join(' | ')
        } else if (typeof err.response.data === 'string') {
          detalle = err.response.data
        }
      }
      setErrorMsg(detalle)
      alert(`Error al actualizar paciente: ${detalle}`)
    } finally {
      setGuardando(false)
    }
  }

  if (cargando) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
        <h1 style={{ color: '#1f5b6a' }}>Editar Paciente</h1>
        <p style={{ color: '#6b7280' }}>Cargando información del paciente...</p>
      </div>
    )
  }

  if (errorMsg && !paciente) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
        <h1 style={{ color: '#1f5b6a' }}>Editar Paciente</h1>
        <div
          style={{
            backgroundColor: '#fee2e2',
            color: '#b91c1c',
            padding: '1rem',
            borderRadius: '6px',
            marginBottom: '1rem',
          }}
        >
          {errorMsg}
        </div>
        <button
          onClick={() => navigate('/pacientes')}
          style={{
            padding: '0.6rem 1.2rem',
            backgroundColor: '#1f5b6a',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Volver a Pacientes
        </button>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem' }}>
      <header style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.8rem', color: '#1f5b6a', margin: '0 0 0.5rem 0' }}>
          Editar Paciente {paciente ? `(#${paciente.id} - ${paciente.nombre_completo})` : ''}
        </h1>
        <p style={{ margin: 0, color: '#6b7280', fontSize: '0.95rem' }}>
          Modifique los datos clínicos del bebé y guarde los cambios en el sistema.
        </p>
      </header>

      {errorMsg && (
        <div
          style={{
            backgroundColor: '#fee2e2',
            color: '#b91c1c',
            padding: '0.75rem 1rem',
            borderRadius: '6px',
            marginBottom: '1rem',
            fontSize: '0.9rem',
          }}
        >
          {errorMsg}
        </div>
      )}

      {paciente && (
        <PacienteForm
          pacienteInicial={paciente}
          onSubmit={handleUpdate}
          isLoading={guardando}
          onCancel={() => navigate('/pacientes')}
        />
      )}
    </div>
  )
}