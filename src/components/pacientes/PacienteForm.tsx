
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  pacienteSchema,
  type PacienteFormData,
} from '@/forms/schemas/pacienteSchema'

import {
  medicosService,
  type Medico,
} from '@/services/medicosService'

type PacienteFormProps = {
  defaultValues?: Partial<PacienteFormData>
  onSubmit: (data: PacienteFormData) => Promise<void>
  modo?: 'crear' | 'editar'
}

export default function PacienteForm({
  defaultValues,
  onSubmit,
  modo = 'crear',
}: PacienteFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [medicos, setMedicos] = useState<Medico[]>([])
  const [cargandoMedicos, setCargandoMedicos] = useState(true)
  const [errorMedicos, setErrorMedicos] = useState<string | null>(null)
  const [errorGuardado, setErrorGuardado] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      isValid,
      isDirty,
    },
  } = useForm<PacienteFormData>({
    resolver: zodResolver(pacienteSchema),
    mode: 'onChange',
    defaultValues,
  })

  // Cargar los médicos registrados en Django.
  useEffect(() => {
    let activo = true

    async function cargarMedicos() {
      try {
        setCargandoMedicos(true)
        setErrorMedicos(null)

        const data = await medicosService.listar()

        if (activo) {
          setMedicos(data)
        }
      } catch (error) {
        console.error('Error al cargar médicos:', error)

        if (activo) {
          setErrorMedicos(
            'No fue posible cargar la lista de médicos.'
          )
        }
      } finally {
        if (activo) {
          setCargandoMedicos(false)
        }
      }
    }

    cargarMedicos()

    return () => {
      activo = false
    }
  }, [])

  // Cargar los datos existentes cuando estamos editando.
  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues)
    }
  }, [defaultValues, reset])

  // Guardar el formulario.
  const handleFormSubmit = async (data: PacienteFormData) => {
    try {
      setIsLoading(true)
      setErrorGuardado(null)

      await onSubmit(data)
    } catch (error) {
      console.error('Error al guardar paciente:', error)

      setErrorGuardado(
        'No fue posible guardar el paciente. Revisa los datos e inténtalo nuevamente.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  // Bloquear el botón si faltan datos obligatorios,
  // si hay una petición en curso o si no hay cambios al editar.
  const botonDeshabilitado =
    !isValid ||
    isLoading ||
    cargandoMedicos ||
    !!errorMedicos ||
    medicos.length === 0 ||
    (modo === 'editar' && !isDirty)

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <h2>
        {modo === 'editar'
          ? 'Editar información del paciente'
          : 'Registrar nuevo paciente'}
      </h2>

      <p>Los campos marcados con * son obligatorios.</p>

      {/* IDENTIFICADOR */}
      <div>
        <label htmlFor="identificador">
          Identificador del paciente *
        </label>

        <input
          id="identificador"
          placeholder="Ej: BEB-0001"
          {...register('identificador')}
        />

        {errors.identificador && (
          <p role="alert">{errors.identificador.message}</p>
        )}
      </div>

      {/* NOMBRE */}
      <div>
        <label htmlFor="nombre">
          Nombre completo *
        </label>

        <input
          id="nombre"
          placeholder="Nombre del paciente"
          {...register('nombre')}
        />

        {errors.nombre && (
          <p role="alert">{errors.nombre.message}</p>
        )}
      </div>

      {/* FECHA DE NACIMIENTO */}
      <div>
        <label htmlFor="fechaNacimiento">
          Fecha de nacimiento *
        </label>

        <input
          id="fechaNacimiento"
          type="date"
          {...register('fechaNacimiento')}
        />

        {errors.fechaNacimiento && (
          <p role="alert">{errors.fechaNacimiento.message}</p>
        )}
      </div>

      {/* SEXO */}
      <div>
        <label htmlFor="sexo">
          Sexo *
        </label>

        <select
          id="sexo"
          defaultValue=""
          {...register('sexo')}
        >
          <option value="">Seleccione sexo</option>
          <option value="Femenino">Femenino</option>
          <option value="Masculino">Masculino</option>
        </select>

        {errors.sexo && (
          <p role="alert">{errors.sexo.message}</p>
        )}
      </div>

      {/* EDAD GESTACIONAL */}
      <div>
        <label htmlFor="edadGestacional">
          Edad gestacional (semanas) *
        </label>

        <input
          id="edadGestacional"
          type="number"
          step="0.1"
          min="0.1"
          placeholder="Ej: 38.5"
          {...register('edadGestacional')}
        />

        {errors.edadGestacional && (
          <p role="alert">{errors.edadGestacional.message}</p>
        )}
      </div>

      {/* PESO */}
      <div>
        <label htmlFor="peso">
          Peso (kg) *
        </label>

        <input
          id="peso"
          type="number"
          step="0.01"
          min="0.01"
          placeholder="Ej: 3.25"
          {...register('peso', {
            valueAsNumber: true,
          })}
        />

        {errors.peso && (
          <p role="alert">{errors.peso.message}</p>
        )}
      </div>

      {/* FECHA DE INGRESO */}
      <div>
        <label htmlFor="fechaIngreso">
          Fecha de ingreso *
        </label>

        <input
          id="fechaIngreso"
          type="date"
          {...register('fechaIngreso')}
        />

        {errors.fechaIngreso && (
          <p role="alert">{errors.fechaIngreso.message}</p>
        )}
      </div>

      {/* MÉDICO RESPONSABLE */}
      <div>
        <label htmlFor="medicoResponsable">
          Médico responsable *
        </label>

        <select
          id="medicoResponsable"
          defaultValue=""
          {...register('medicoResponsable')}
          disabled={cargandoMedicos || !!errorMedicos}
        >
          <option value="">
            {cargandoMedicos
              ? 'Cargando médicos...'
              : 'Seleccione un médico'}
          </option>

          {medicos.map((medico) => (
            <option
              key={medico.id}
              value={String(medico.id)}
            >
              {medico.nombre_completo}
            </option>
          ))}
        </select>

        {errors.medicoResponsable && (
          <p role="alert">
            {errors.medicoResponsable.message}
          </p>
        )}

        {errorMedicos && (
          <p role="alert">{errorMedicos}</p>
        )}

        {!cargandoMedicos &&
          !errorMedicos &&
          medicos.length === 0 && (
            <p role="alert">
              No hay médicos registrados en el sistema.
            </p>
          )}
      </div>

      {/* DIAGNÓSTICO */}
      <div>
        <label htmlFor="diagnostico">
          Diagnóstico principal *
        </label>

        <input
          id="diagnostico"
          placeholder="Diagnóstico del paciente"
          {...register('diagnostico')}
        />

        {errors.diagnostico && (
          <p role="alert">{errors.diagnostico.message}</p>
        )}
      </div>

      {/* OBSERVACIONES */}
      <div>
        <label htmlFor="observaciones">
          Observaciones (opcional)
        </label>

        <textarea
          id="observaciones"
          rows={4}
          placeholder="Observaciones adicionales"
          {...register('observaciones')}
        />

        {errors.observaciones && (
          <p role="alert">{errors.observaciones.message}</p>
        )}
      </div>

      {/* ERROR AL GUARDAR */}
      {errorGuardado && (
        <p role="alert">{errorGuardado}</p>
      )}

      {/* BOTÓN */}
      <button
        type="submit"
        disabled={botonDeshabilitado}
      >
        {isLoading
          ? 'Guardando...'
          : modo === 'editar'
            ? 'Actualizar paciente'
            : 'Registrar paciente'}
      </button>
    </form>
  )
}
