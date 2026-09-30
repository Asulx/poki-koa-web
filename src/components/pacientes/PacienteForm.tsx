import React, { useEffect, useState } from 'react'
import type { Medico, Paciente, PacientePayload } from '@/types/paciente'
import { pacientesService } from '@/services/pacientesService'

export type { PacientePayload }

// Exportamos también como PacienteFormData por compatibilidad de tipos
export type PacienteFormData = PacientePayload

interface PacienteFormProps {
  pacienteInicial?: Partial<PacientePayload> | Partial<Paciente>
  defaultValues?: Partial<PacientePayload> | Partial<Paciente>
  onSubmit: (datos: PacientePayload) => Promise<void> | void
  isLoading?: boolean
  onCancel?: () => void
}

export default function PacienteForm({
  pacienteInicial,
  defaultValues,
  onSubmit,
  isLoading = false,
  onCancel,
}: PacienteFormProps) {
  const initial = pacienteInicial || defaultValues

  // Manejamos compatibilidad con posibles datos previos o diferentes nombres de campos
  const [formData, setFormData] = useState({
    identificador: initial?.identificador ?? '',
    nombre_completo:
      initial?.nombre_completo ?? (initial as any)?.nombre ?? '',
    edad_meses:
      initial?.edad_meses !== null && initial?.edad_meses !== undefined
        ? String(initial.edad_meses)
        : '',
    sexo:
      initial?.sexo === 'Masculino'
        ? 'M'
        : initial?.sexo === 'Femenino'
        ? 'F'
        : initial?.sexo ?? 'F',
    peso:
      initial?.peso !== null && initial?.peso !== undefined
        ? String(initial.peso)
        : '',
    fecha_nacimiento:
      initial?.fecha_nacimiento ?? (initial as any)?.fechaNacimiento ?? '',
    fecha_ingreso: initial?.fecha_ingreso
      ? initial.fecha_ingreso.split('T')[0]
      : (initial as any)?.fechaIngreso ??
        new Date().toISOString().split('T')[0],
    diagnostico: initial?.diagnostico ?? '',
    plan_cuidados:
      initial?.plan_cuidados ?? (initial as any)?.observaciones ?? '',
    medico_a_cargo:
      initial?.medico_a_cargo !== null && initial?.medico_a_cargo !== undefined
        ? String(initial.medico_a_cargo)
        : '',
  })

  const [medicos, setMedicos] = useState<Medico[]>([])
  const [cargandoMedicos, setCargandoMedicos] = useState(false)
  const [errores, setErrores] = useState<Record<string, string>>({})

  // Cargar médicos para el selector
  useEffect(() => {
    let activo = true
    async function cargarMedicos() {
      setCargandoMedicos(true)
      try {
        const lista = await pacientesService.listarMedicos()
        if (activo) {
          setMedicos(lista)
        }
      } catch (err) {
        console.warn('No se pudo cargar la lista de médicos', err)
      } finally {
        if (activo) setCargandoMedicos(false)
      }
    }
    cargarMedicos()
    return () => {
      activo = false
    }
  }, [])

  // Sincronizar si cambia initial
  useEffect(() => {
    if (initial) {
      setFormData({
        identificador: initial.identificador ?? '',
        nombre_completo:
          initial.nombre_completo ?? (initial as any).nombre ?? '',
        edad_meses:
          initial.edad_meses !== null && initial.edad_meses !== undefined
            ? String(initial.edad_meses)
            : '',
        sexo:
          initial.sexo === 'Masculino'
            ? 'M'
            : initial.sexo === 'Femenino'
            ? 'F'
            : initial.sexo ?? 'F',
        peso:
          initial.peso !== null && initial.peso !== undefined
            ? String(initial.peso)
            : '',
        fecha_nacimiento:
          initial.fecha_nacimiento ?? (initial as any).fechaNacimiento ?? '',
        fecha_ingreso: initial.fecha_ingreso
          ? initial.fecha_ingreso.split('T')[0]
          : (initial as any).fechaIngreso ??
            new Date().toISOString().split('T')[0],
        diagnostico: initial.diagnostico ?? '',
        plan_cuidados:
          initial.plan_cuidados ?? (initial as any).observaciones ?? '',
        medico_a_cargo:
          initial.medico_a_cargo !== null &&
          initial.medico_a_cargo !== undefined
            ? String(initial.medico_a_cargo)
            : '',
      })
    }
  }, [initial])

  const validarCampo = (campo: string, valor: string) => {
    let error = ''
    if (campo === 'identificador') {
      if (valor.trim() === '') {
        error = 'El identificador es obligatorio.'
      } else if (valor.trim().length > 30) {
        error = 'El identificador no puede exceder los 30 caracteres.'
      }
    }
    if (campo === 'nombre_completo' && valor.trim() === '') {
      error = 'El nombre completo es obligatorio.'
    }
    if (campo === 'peso' && valor.trim() !== '') {
      const num = Number(valor)
      if (isNaN(num) || num <= 0) {
        error = 'El peso debe ser un número mayor a 0 kg.'
      }
    }
    if (campo === 'edad_meses' && valor.trim() !== '') {
      const num = Number(valor)
      if (isNaN(num) || !Number.isInteger(num) || num < 0) {
        error = 'La edad debe ser un número entero mayor o igual a 0.'
      }
    }
    if (campo === 'fecha_nacimiento' && valor.trim() !== '') {
      const fecha = new Date(valor)
      const hoy = new Date()
      hoy.setHours(23, 59, 59, 999)
      if (fecha > hoy) {
        error = 'La fecha de nacimiento no puede ser futura.'
      }
    }
    setErrores((prev) => ({ ...prev, [campo]: error }))
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    validarCampo(name, value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validar requeridos
    if (formData.identificador.trim() === '') {
      setErrores((prev) => ({
        ...prev,
        identificador: 'El identificador es obligatorio.',
      }))
      return
    }

    if (formData.identificador.trim().length > 30) {
      setErrores((prev) => ({
        ...prev,
        identificador: 'El identificador no puede exceder los 30 caracteres.',
      }))
      return
    }

    if (formData.nombre_completo.trim() === '') {
      setErrores((prev) => ({
        ...prev,
        nombre_completo: 'El nombre completo es obligatorio.',
      }))
      return
    }

    // Comprobar si hay errores activos
    const tieneErrores = Object.values(errores).some((err) => err !== '')
    if (tieneErrores) return

    // Construir el payload con los tipos exactos esperados por api/bebes/
    const payload: PacientePayload = {
      identificador: formData.identificador.trim(),
      nombre_completo: formData.nombre_completo.trim(),
      edad_meses:
        formData.edad_meses.trim() !== ''
          ? parseInt(formData.edad_meses, 10)
          : null,
      sexo: formData.sexo ? formData.sexo : null,
      peso:
        formData.peso.trim() !== '' ? parseFloat(formData.peso) : null,
      fecha_nacimiento:
        formData.fecha_nacimiento.trim() !== ''
          ? formData.fecha_nacimiento
          : null,
      fecha_ingreso:
        formData.fecha_ingreso.trim() !== ''
          ? new Date(formData.fecha_ingreso).toISOString()
          : null,
      diagnostico: formData.diagnostico.trim(),
      plan_cuidados: formData.plan_cuidados.trim(),
      medico_a_cargo:
        formData.medico_a_cargo.trim() !== ''
          ? parseInt(formData.medico_a_cargo, 10)
          : null,
    }

    await onSubmit(payload)
  }

  const handleLimpiar = () => {
    setFormData({
      identificador: '',
      nombre_completo: '',
      edad_meses: '',
      sexo: 'F',
      peso: '',
      fecha_nacimiento: '',
      fecha_ingreso: new Date().toISOString().split('T')[0],
      diagnostico: '',
      plan_cuidados: '',
      medico_a_cargo: '',
    })
    setErrores({})
  }

  // Estilos visuales acordes a la estética de Poki Koa
  const sectionStyle: React.CSSProperties = {
    marginBottom: '1.5rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid #e5e7eb',
  }
  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '1rem',
    marginTop: '0.75rem',
  }
  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.8rem',
    fontWeight: 600,
    color: '#4b5563',
    marginBottom: '0.35rem',
    textTransform: 'uppercase',
  }
  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.65rem 0.8rem',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    backgroundColor: '#f9fafb',
    fontSize: '0.9rem',
    color: '#111827',
    boxSizing: 'border-box',
    outline: 'none',
  }
  const errorStyle: React.CSSProperties = {
    color: '#dc2626',
    fontSize: '0.75rem',
    marginTop: '0.25rem',
    display: 'block',
  }

  const estaInvalido =
    formData.nombre_completo.trim() === '' ||
    Object.values(errores).some((err) => err !== '')

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        backgroundColor: '#ffffff',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        maxWidth: '750px',
      }}
    >
      {/* SECCIÓN 1: DATOS PERSONALES */}
      <div style={sectionStyle}>
        <h3
          style={{
            fontSize: '0.95rem',
            color: '#1f5b6a',
            margin: '0 0 0.5rem 0',
            fontWeight: 700,
          }}
        >
          INFORMACIÓN DEL RECIÉN NACIDO
        </h3>
        <div style={gridStyle}>
          <div>
            <label style={labelStyle}>
              Identificador <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input
              type="text"
              name="identificador"
              value={formData.identificador}
              onChange={handleChange}
              maxLength={30}
              placeholder="Ej: BEB-0001"
              style={{
                ...inputStyle,
                border: errores.identificador
                  ? '1px solid #dc2626'
                  : inputStyle.border,
              }}
            />
            {errores.identificador && (
              <span style={errorStyle}>{errores.identificador}</span>
            )}
          </div>

          <div>
            <label style={labelStyle}>
              Nombre Completo <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input
              type="text"
              name="nombre_completo"
              value={formData.nombre_completo}
              onChange={handleChange}
              placeholder="Ej: Sofía García"
              style={{
                ...inputStyle,
                border: errores.nombre_completo
                  ? '1px solid #dc2626'
                  : inputStyle.border,
              }}
            />
            {errores.nombre_completo && (
              <span style={errorStyle}>{errores.nombre_completo}</span>
            )}
          </div>

          <div>
            <label style={labelStyle}>Edad (Meses)</label>
            <input
              type="number"
              name="edad_meses"
              min="0"
              step="1"
              value={formData.edad_meses}
              onChange={handleChange}
              placeholder="Ej: 2"
              style={{
                ...inputStyle,
                border: errores.edad_meses
                  ? '1px solid #dc2626'
                  : inputStyle.border,
              }}
            />
            {errores.edad_meses && (
              <span style={errorStyle}>{errores.edad_meses}</span>
            )}
          </div>

          <div>
            <label style={labelStyle}>Sexo</label>
            <select
              name="sexo"
              value={formData.sexo}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="F">Femenino</option>
              <option value="M">Masculino</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>Peso (KG)</label>
            <input
              type="number"
              name="peso"
              step="0.01"
              min="0.01"
              value={formData.peso}
              onChange={handleChange}
              placeholder="Ej: 3.25"
              style={{
                ...inputStyle,
                border: errores.peso
                  ? '1px solid #dc2626'
                  : inputStyle.border,
              }}
            />
            {errores.peso && (
              <span style={errorStyle}>{errores.peso}</span>
            )}
          </div>

          <div>
            <label style={labelStyle}>Fecha de Nacimiento</label>
            <input
              type="date"
              name="fecha_nacimiento"
              value={formData.fecha_nacimiento}
              onChange={handleChange}
              style={{
                ...inputStyle,
                border: errores.fecha_nacimiento
                  ? '1px solid #dc2626'
                  : inputStyle.border,
              }}
            />
            {errores.fecha_nacimiento && (
              <span style={errorStyle}>{errores.fecha_nacimiento}</span>
            )}
          </div>

          <div>
            <label style={labelStyle}>Fecha de Ingreso</label>
            <input
              type="date"
              name="fecha_ingreso"
              value={formData.fecha_ingreso}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
        </div>
      </div>

      {/* SECCIÓN 2: ASIGNACIÓN MÉDICA Y CLÍNICA */}
      <div style={sectionStyle}>
        <h3
          style={{
            fontSize: '0.95rem',
            color: '#1f5b6a',
            margin: '0 0 0.5rem 0',
            fontWeight: 700,
          }}
        >
          SEGUIMIENTO CLÍNICO
        </h3>
        <div style={gridStyle}>
          <div>
            <label style={labelStyle}>Médico a Cargo</label>
            <select
              name="medico_a_cargo"
              value={formData.medico_a_cargo}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="">
                {cargandoMedicos
                  ? 'Cargando médicos...'
                  : 'Sin médico asignado (Opcional)'}
              </option>
              {medicos.map((medico) => (
                <option key={medico.id} value={medico.id}>
                  {medico.nombre_completo}
                  {medico.turno ? ` (${medico.turno})` : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <label style={labelStyle}>Diagnóstico Médico</label>
          <textarea
            name="diagnostico"
            value={formData.diagnostico}
            onChange={handleChange}
            placeholder="Diagnóstico clínico principal o motivo de ingreso"
            rows={2}
            style={{
              ...inputStyle,
              fontFamily: 'inherit',
              resize: 'vertical',
            }}
          />
        </div>

        <div style={{ marginTop: '1rem' }}>
          <label style={labelStyle}>Plan de Cuidados</label>
          <textarea
            name="plan_cuidados"
            value={formData.plan_cuidados}
            onChange={handleChange}
            placeholder="Protocolos de atención, monitoreo de signos vitales o cuidados asignados"
            rows={2}
            style={{
              ...inputStyle,
              fontFamily: 'inherit',
              resize: 'vertical',
            }}
          />
        </div>
      </div>

      {/* BOTONES DE ACCIÓN */}
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
        <button
          type="submit"
          disabled={estaInvalido || isLoading}
          style={{
            backgroundColor: estaInvalido || isLoading ? '#9ca3af' : '#1f5b6a',
            color: '#ffffff',
            flex: 1,
            padding: '0.8rem 1.5rem',
            borderRadius: '6px',
            border: 'none',
            cursor: estaInvalido || isLoading ? 'not-allowed' : 'pointer',
            fontWeight: 600,
            fontSize: '0.95rem',
            transition: 'background-color 0.2s',
          }}
        >
          {isLoading
            ? 'Guardando...'
            : initial
            ? 'Actualizar Paciente'
            : 'Registrar Paciente'}
        </button>

        <button
          type="button"
          onClick={handleLimpiar}
          disabled={isLoading}
          style={{
            padding: '0.8rem 1.8rem',
            borderRadius: '6px',
            border: '1px solid #d1d5db',
            backgroundColor: '#ffffff',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontWeight: 600,
            fontSize: '0.95rem',
            color: '#4b5563',
          }}
        >
          Limpiar
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            style={{
              padding: '0.8rem 1.5rem',
              borderRadius: '6px',
              border: '1px solid #d1d5db',
              backgroundColor: '#f3f4f6',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontWeight: 500,
              fontSize: '0.95rem',
              color: '#374151',
            }}
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  )
}