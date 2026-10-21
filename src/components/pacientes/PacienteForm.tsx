import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  pacienteSchema,
  type PacienteFormData,
} from '@/forms/schemas/pacienteSchema'

type PacienteFormProps = {
  defaultValues?: Partial<PacienteFormData>
  onSubmit: (data: PacienteFormData) => Promise<void>
}

export default function PacienteForm({
  defaultValues,
  onSubmit,
}: PacienteFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<PacienteFormData>({
    resolver: zodResolver(pacienteSchema),
    mode: 'onChange',
    defaultValues,
  })

  const handleFormSubmit = async (
    data: PacienteFormData
  ) => {
    try {
      setIsLoading(true)

      await onSubmit(data)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <h2>Información Personal</h2>

      <div>
        <label>Nombre completo</label>

        <input {...register('nombre')} />

        {errors.nombre && (
          <p>{errors.nombre.message}</p>
        )}
      </div>

      <div>
        <label>Fecha de nacimiento</label>

        <input
          type="date"
          {...register('fechaNacimiento')}
        />

        {errors.fechaNacimiento && (
          <p>{errors.fechaNacimiento.message}</p>
        )}
      </div>

      <div>
        <label>Sexo</label>

        <select {...register('sexo')}>
          <option value="">
            Seleccione
          </option>

          <option value="Femenino">
            Femenino
          </option>

          <option value="Masculino">
            Masculino
          </option>
        </select>

        {errors.sexo && (
          <p>{errors.sexo.message}</p>
        )}
      </div>

      <div>
        <label>Edad gestacional</label>

        <input
          {...register('edadGestacional')}
        />

        {errors.edadGestacional && (
          <p>{errors.edadGestacional.message}</p>
        )}
      </div>

      <div>
        <label>Peso (kg)</label>

        <input
          type="number"
          step="0.1"
          {...register('peso', {
            valueAsNumber: true,
          })}
        />

        {errors.peso && (
          <p>{errors.peso.message}</p>
        )}
      </div>

      <div>
        <label>Número de cuna</label>

        <input
          {...register('numeroCuna')}
        />

        {errors.numeroCuna && (
          <p>{errors.numeroCuna.message}</p>
        )}
      </div>

      <div>
        <label>Fecha de ingreso</label>

        <input
          type="date"
          {...register('fechaIngreso')}
        />

        {errors.fechaIngreso && (
          <p>{errors.fechaIngreso.message}</p>
        )}
      </div>

      <div>
        <label>Médico responsable</label>

        <input
          {...register('medicoResponsable')}
        />

        {errors.medicoResponsable && (
          <p>
            {errors.medicoResponsable.message}
          </p>
        )}
      </div>

      <div>
        <label>Diagnóstico principal</label>

        <input
          {...register('diagnostico')}
        />

        {errors.diagnostico && (
          <p>{errors.diagnostico.message}</p>
        )}
      </div>

      <div>
        <label>Estado de cánula</label>

        <select
          {...register('estadoCanula')}
        >
          <option value="">
            Seleccione
          </option>

          <option value="OK">
            OK
          </option>

          <option value="Pendiente">
            Pendiente
          </option>
        </select>

        {errors.estadoCanula && (
          <p>{errors.estadoCanula.message}</p>
        )}
      </div>

      <div>
        <label>Vía intravenosa</label>

        <select
          {...register('viaIntravenosa')}
        >
          <option value="">
            Seleccione
          </option>

          <option value="Activa">
            Activa
          </option>

          <option value="Inactiva">
            Inactiva
          </option>
        </select>

        {errors.viaIntravenosa && (
          <p>{errors.viaIntravenosa.message}</p>
        )}
      </div>

      <div>
        <label>Observaciones</label>

        <textarea
          {...register('observaciones')}
        />

        {errors.observaciones && (
          <p>{errors.observaciones.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={!isValid || isLoading}
      >
        {isLoading
          ? 'Guardando...'
          : 'Guardar Paciente'}
      </button>
    </form>
  )
}