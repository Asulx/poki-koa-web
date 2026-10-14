
import type { PacienteFormData } from '@/forms/schemas/pacienteSchema'
import { calcularEdadMeses } from '@/utils/calcularEdadMeses'

export type BebePayload = {
  identificador: string
  nombre_completo: string
  edad_meses: number
  fecha_nacimiento: string
  fecha_ingreso: string
  sexo: 'F' | 'M'
  edad_gestacional: number
  peso: number
  diagnostico: string
  observaciones: string
  medico_a_cargo: number
}

export function convertirPacienteParaDjango(
  data: PacienteFormData,
  medicoId: number
): BebePayload {
  if (!Number.isInteger(medicoId) || medicoId <= 0) {
    throw new Error('Debe seleccionar un médico válido')
  }

  return {
    identificador: data.identificador.trim(),
    nombre_completo: data.nombre.trim(),

    edad_meses: calcularEdadMeses(data.fechaNacimiento),

    fecha_nacimiento: data.fechaNacimiento,

    // El campo DateTimeField acepta fecha y hora ISO 8601.
    fecha_ingreso: `${data.fechaIngreso}T00:00:00`,

    sexo: data.sexo === 'Femenino' ? 'F' : 'M',

    edad_gestacional: Number(data.edadGestacional),
    peso: data.peso,

    diagnostico: data.diagnostico.trim(),
    observaciones: data.observaciones?.trim() ?? '',

    medico_a_cargo: medicoId,
  }
}
