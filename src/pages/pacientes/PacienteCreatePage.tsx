import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PacienteForm from '@/components/pacientes/PacienteForm'
import { pacientesService } from '@/services/pacientesService'
import type { PacientePayload } from '@/types/paciente'

export default function PacienteCreatePage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleCreate = async (data: PacientePayload) => {
    setIsLoading(true)
    setErrorMsg(null)
    try {
      const nuevoBebe = await pacientesService.crear(data)
      alert(`¡Paciente "${nuevoBebe.nombre_completo}" registrado con éxito!`)
      navigate('/pacientes')
    } catch (error: any) {
      console.error('Error al registrar paciente:', error)
      let detalle = 'No fue posible registrar el paciente. Verifique la conexión con el servidor.'
      if (error.response?.data) {
        if (typeof error.response.data === 'object') {
          detalle = Object.entries(error.response.data)
            .map(([campo, msgs]) => `${campo}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
            .join(' | ')
        } else if (typeof error.response.data === 'string') {
          detalle = error.response.data
        }
      }
      setErrorMsg(detalle)
      alert(`Error al registrar paciente: ${detalle}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem' }}>
      <header style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.8rem', color: '#1f5b6a', margin: '0 0 0.5rem 0' }}>
          Registrar Paciente
        </h1>
        <p style={{ margin: 0, color: '#6b7280', fontSize: '0.95rem' }}>
          Ingrese los datos clínicos y personales del recién nacido para darlo de alta en el sistema.
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

      <PacienteForm
        onSubmit={handleCreate}
        isLoading={isLoading}
        onCancel={() => navigate('/pacientes')}
      />
    </div>
  )
}