import { useEffect, useState } from 'react'
import {
  useNavigate,
  useParams,
} from 'react-router-dom'

import PacienteForm from '@/components/pacientes/PacienteForm'
import { pacientesService } from '@/services/pacientesService'

import type { Paciente } from '@/types/paciente'
import type { PacienteFormData } from '@/forms/schemas/pacienteSchema'

export default function PacienteEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [paciente, setPaciente] =
    useState<Paciente | null>(null)

  const [isLoading, setIsLoading] =
    useState(true)

  const [error, setError] =
    useState<string | null>(null)

  useEffect(() => {
    async function cargarPaciente() {
      if (!id) {
        setError(
          'No se encontró el identificador del paciente.'
        )
        setIsLoading(false)
        return
      }

      const pacienteId = Number(id)

      if (Number.isNaN(pacienteId)) {
        setError(
          'El identificador del paciente no es válido.'
        )
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        const data =
          await pacientesService.obtenerPorId(
            pacienteId
          )

        setPaciente(data)
      } catch (error) {
        console.error(
          'Error al cargar el paciente:',
          error
        )

        setError(
          'No fue posible cargar la información del paciente.'
        )
      } finally {
        setIsLoading(false)
      }
    }

    cargarPaciente()
  }, [id])

  const handleUpdate = async (
    data: PacienteFormData
  ) => {
    if (!id) {
      return
    }

    const pacienteId = Number(id)

    if (Number.isNaN(pacienteId)) {
      return
    }

    try {
      await pacientesService.actualizar(
        pacienteId,
        data
      )

      alert(
        'Paciente actualizado correctamente'
      )

      navigate('/pacientes')
    } catch (error) {
      console.error(
        'Error al actualizar paciente:',
        error
      )

      alert(
        'No fue posible actualizar el paciente.'
      )
    }
  }

  if (isLoading) {
    return (
      <div>
        <h1>Editar Paciente</h1>
        <p>Cargando paciente...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <h1>Editar Paciente</h1>
        <p>{error}</p>
      </div>
    )
  }

  if (!paciente) {
    return (
      <div>
        <h1>Editar Paciente</h1>
        <p>Paciente no encontrado.</p>
      </div>
    )
  }

  return (
    <>
      <h1>Editar Paciente</h1>

      <PacienteForm
        defaultValues={paciente}
        onSubmit={handleUpdate}
      />
    </>
  )
}