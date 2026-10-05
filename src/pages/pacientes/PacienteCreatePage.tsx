import { useNavigate } from 'react-router-dom'

import PacienteForm from '@/components/pacientes/PacienteForm'
import { pacientesService } from '@/services/pacientesService'

import type { PacienteFormData } from '@/forms/schemas/pacienteSchema'

export default function PacienteCreatePage() {
  const navigate = useNavigate()

  const handleCreate = async (
    data: PacienteFormData
  ) => {
    try {
      await pacientesService.crear(data)

      alert('Paciente registrado correctamente')

      navigate('/pacientes')
    } catch (error) {
      console.error(
        'Error al registrar paciente:',
        error
      )

      alert('No fue posible registrar el paciente.')
    }
  }

  return (
    <>
      <h1>Registrar Paciente</h1>

      <PacienteForm onSubmit={handleCreate} />
    </>
  )
}