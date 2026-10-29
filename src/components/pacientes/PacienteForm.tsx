/**
 * @file PacienteForm.tsx
 * @description Formulario compartido de alta y edición de pacientes. Usa
 * React Hook Form con validación Zod y presenta los errores campo a campo.
 */

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type Resolver } from 'react-hook-form';

import Button from '@/components/ui/Button/Button';
import Input from '@/components/ui/Input/Input';
import {
  pacienteSchema,
  type PacienteFormData,
} from '@/schemas/pacienteSchema';
import type { Medico } from '@/types/medico';
import type { Paciente, PacientePayload } from '@/types/paciente';

import './PacienteForm.css';

/** Propiedades del formulario. */
interface PacienteFormProps {
  /** Paciente existente (modo edición). */
  paciente?: Paciente;
  /** Médicos disponibles para asignar. */
  medicos: Medico[];
  /** Indica que la petición está en curso. */
  guardando?: boolean;
  /** Error general devuelto por la API. */
  error?: string;
  /** Acción al enviar un formulario válido. */
  onSubmit: (datos: PacientePayload) => void | Promise<void>;
  /** Acción de cancelación. */
  onCancelar: () => void;
}

/**
 * Convierte un paciente del dominio en los valores iniciales del formulario.
 *
 * @param paciente - Paciente a editar.
 * @returns Valores compatibles con el esquema.
 */
function valoresIniciales(paciente?: Paciente): PacienteFormData {
  return {
    identificador: paciente?.identificador ?? '',
    nombreCompleto: paciente?.nombreCompleto ?? '',
    edadMeses: paciente?.edadMeses ?? 0,
    edadGestacional: paciente?.edadGestacional ?? undefined,
    sexo: paciente?.sexo ?? 'F',
    peso: paciente?.peso ?? undefined,
    fechaNacimiento: paciente?.fechaNacimiento?.slice(0, 10) ?? '',
    diagnostico: paciente?.diagnostico ?? '',
    observaciones: paciente?.observaciones ?? '',
    planCuidados: paciente?.planCuidados ?? '',
    medicoACargo: paciente?.medicoId ?? undefined,
  };
}

/**
 * Formulario clínico de paciente.
 *
 * @param props - Paciente, médicos y acciones.
 * @returns Campos organizados por secciones.
 */
export default function PacienteForm({
  paciente,
  medicos,
  guardando = false,
  error,
  onSubmit,
  onCancelar,
}: PacienteFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PacienteFormData>({
    defaultValues: valoresIniciales(paciente),
    // El esquema usa `preprocess` para normalizar números; el cast mantiene
    // el tipado del formulario sin perder la validación real de Zod.
    resolver: zodResolver(pacienteSchema) as Resolver<PacienteFormData>,
  });

  /**
   * Adapta los valores del formulario al contrato de la API.
   *
   * @param datos - Datos validados.
   */
  const enviar = (datos: PacienteFormData) => {
    const payload: PacientePayload = {
      identificador: datos.identificador,
      nombreCompleto: datos.nombreCompleto,
      edadMeses: Number(datos.edadMeses),
      edadGestacional: datos.edadGestacional ?? null,
      sexo: datos.sexo,
      peso: datos.peso ?? null,
      fechaNacimiento: datos.fechaNacimiento || null,
      diagnostico: datos.diagnostico ?? '',
      observaciones: datos.observaciones ?? '',
      planCuidados: datos.planCuidados ?? '',
      medicoACargo: datos.medicoACargo ?? null,
    };

    void onSubmit(payload);
  };

  return (
    <form
      className="formulario-paciente"
      onSubmit={handleSubmit(enviar)}
      noValidate
    >
      {error && (
        <div className="mensaje mensaje--error" role="alert">
          <span aria-hidden="true">!</span>
          <span>{error}</span>
        </div>
      )}

      <section className="formulario-paciente__seccion">
        <h3 className="formulario-paciente__titulo">Identificación</h3>
        <div className="campo-fila">
          <Input
            etiqueta="Identificador clínico *"
            placeholder="RN-2026-014"
            error={errors.identificador?.message}
            {...register('identificador')}
          />
          <Input
            etiqueta="Nombre completo *"
            placeholder="Apellidos, nombres"
            error={errors.nombreCompleto?.message}
            {...register('nombreCompleto')}
          />
        </div>

        <div className="campo-fila campo-fila--3">
          <div className="campo">
            <label className="campo__label" htmlFor="sexo">
              Sexo *
            </label>
            <select
              id="sexo"
              className={`campo__control ${errors.sexo ? 'campo__control--error' : ''}`}
              {...register('sexo')}
            >
              <option value="F">Femenino</option>
              <option value="M">Masculino</option>
            </select>
            {errors.sexo && (
              <span className="campo__error">{errors.sexo.message}</span>
            )}
          </div>

          <Input
            etiqueta="Edad (meses) *"
            type="number"
            min={0}
            max={24}
            step={1}
            error={errors.edadMeses?.message}
            {...register('edadMeses')}
          />

          <Input
            etiqueta="Edad gestacional (semanas)"
            type="number"
            min={20}
            max={45}
            step={0.1}
            error={errors.edadGestacional?.message}
            {...register('edadGestacional')}
          />
        </div>

        <div className="campo-fila campo-fila--3">
          <Input
            etiqueta="Peso (kg)"
            type="number"
            min={0}
            step={0.01}
            error={errors.peso?.message}
            {...register('peso')}
          />
          <Input
            etiqueta="Fecha de nacimiento"
            type="date"
            error={errors.fechaNacimiento?.message}
            {...register('fechaNacimiento')}
          />
          <div className="campo">
            <label className="campo__label" htmlFor="medicoACargo">
              Médico a cargo
            </label>
            <select
              id="medicoACargo"
              className="campo__control"
              {...register('medicoACargo')}
            >
              <option value="">Sin asignar</option>
              {medicos.map((medico) => (
                <option key={medico.id} value={medico.id}>
                  {medico.nombreCompleto}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="formulario-paciente__seccion">
        <h3 className="formulario-paciente__titulo">Información clínica</h3>

        <div className="campo">
          <label className="campo__label" htmlFor="diagnostico">
            Diagnóstico de ingreso
          </label>
          <textarea
            id="diagnostico"
            className="campo__control"
            placeholder="Diagnóstico principal y comorbilidades"
            {...register('diagnostico')}
          />
          {errors.diagnostico && (
            <span className="campo__error">{errors.diagnostico.message}</span>
          )}
        </div>

        <div className="campo">
          <label className="campo__label" htmlFor="planCuidados">
            Plan de cuidados inicial
          </label>
          <textarea
            id="planCuidados"
            className="campo__control"
            placeholder="Indicaciones generales de enfermería"
            {...register('planCuidados')}
          />
          {errors.planCuidados && (
            <span className="campo__error">{errors.planCuidados.message}</span>
          )}
        </div>

        <div className="campo">
          <label className="campo__label" htmlFor="observaciones">
            Observaciones
          </label>
          <textarea
            id="observaciones"
            className="campo__control"
            placeholder="Antecedentes, alergias u otra información relevante"
            {...register('observaciones')}
          />
          {errors.observaciones && (
            <span className="campo__error">{errors.observaciones.message}</span>
          )}
        </div>
      </section>

      <footer className="formulario-paciente__pie">
        <Button variante="secundario" onClick={onCancelar} disabled={guardando}>
          Cancelar
        </Button>
        <Button type="submit" cargando={guardando}>
          {paciente ? 'Guardar cambios' : 'Registrar paciente'}
        </Button>
      </footer>
    </form>
  );
}
