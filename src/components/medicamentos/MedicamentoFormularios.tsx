/**
 * @file MedicamentoFormularios.tsx
 * @description Formularios del inventario farmacéutico y de prescripciones.
 */

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type Resolver } from 'react-hook-form';

import Button from '@/components/ui/Button/Button';
import Input from '@/components/ui/Input/Input';
import {
  catalogoSchema,
  prescripcionSchema,
  type CatalogoFormData,
  type PrescripcionFormData,
} from '@/schemas/medicamentoSchema';
import type {
  CatalogoPayload,
  MedicamentoCatalogo,
  MedicamentoPayload,
  ViaAdministracion,
} from '@/types/medicamento';
import type { Paciente } from '@/types/paciente';

/** Propiedades del formulario de catálogo. */
interface CatalogoFormProps {
  producto?: MedicamentoCatalogo;
  guardando?: boolean;
  error?: string;
  onSubmit: (datos: CatalogoPayload) => void | Promise<void>;
  onCancelar: () => void;
}

/**
 * Formulario de producto del inventario.
 *
 * @param props - Producto a editar y acciones.
 * @returns Campos del catálogo.
 */
export function CatalogoForm({
  producto,
  guardando = false,
  error,
  onSubmit,
  onCancelar,
}: CatalogoFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CatalogoFormData>({
    defaultValues: {
      nombre: producto?.nombre ?? '',
      principioActivo: producto?.principioActivo ?? '',
      dosisMg: producto?.dosisMg ?? 0,
      stock: producto?.stock ?? 0,
    },
    resolver: zodResolver(catalogoSchema) as Resolver<CatalogoFormData>,
  });

  /**
   * Envía el producto validado.
   *
   * @param datos - Datos del formulario.
   */
  const enviar = (datos: CatalogoFormData) => {
    void onSubmit({
      nombre: datos.nombre,
      principioActivo: datos.principioActivo,
      dosisMg: Number(datos.dosisMg),
      stock: Number(datos.stock),
    });
  };

  return (
    <form
      className="formulario-medicamento"
      onSubmit={handleSubmit(enviar)}
      noValidate
    >
      {error && (
        <div className="mensaje mensaje--error" role="alert">
          <span aria-hidden="true">!</span>
          <span>{error}</span>
        </div>
      )}

      <Input
        etiqueta="Nombre comercial *"
        placeholder="Ej. Cafeína citrato"
        error={errors.nombre?.message}
        {...register('nombre')}
      />

      <Input
        etiqueta="Principio activo *"
        placeholder="Ej. Cafeína"
        error={errors.principioActivo?.message}
        {...register('principioActivo')}
      />

      <div className="campo-fila">
        <Input
          etiqueta="Dosis (mg) *"
          type="number"
          min={0}
          step={0.01}
          error={errors.dosisMg?.message}
          {...register('dosisMg')}
        />
        <Input
          etiqueta="Stock disponible *"
          type="number"
          min={0}
          step={1}
          error={errors.stock?.message}
          {...register('stock')}
        />
      </div>

      <div className="formulario-medicamento__pie">
        <Button variante="secundario" onClick={onCancelar} disabled={guardando}>
          Cancelar
        </Button>
        <Button type="submit" cargando={guardando}>
          {producto ? 'Guardar cambios' : 'Agregar al inventario'}
        </Button>
      </div>
    </form>
  );
}

/** Propiedades del formulario de prescripción. */
interface PrescripcionFormProps {
  pacientes: Paciente[];
  guardando?: boolean;
  error?: string;
  onSubmit: (datos: MedicamentoPayload) => void | Promise<void>;
  onCancelar: () => void;
}

/**
 * Formulario de prescripción médica.
 *
 * @param props - Pacientes disponibles y acciones.
 * @returns Campos de la prescripción.
 */
export function PrescripcionForm({
  pacientes,
  guardando = false,
  error,
  onSubmit,
  onCancelar,
}: PrescripcionFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PrescripcionFormData>({
    defaultValues: {
      paciente: undefined,
      nombre: '',
      dosis: '',
      via: 'IV',
      hora: '08:00',
      estado: 'Pendiente',
    },
    resolver: zodResolver(prescripcionSchema) as Resolver<PrescripcionFormData>,
  });

  /**
   * Envía la prescripción validada.
   *
   * @param datos - Datos del formulario.
   */
  const enviar = (datos: PrescripcionFormData) => {
    void onSubmit({
      paciente: Number(datos.paciente),
      nombre: datos.nombre,
      dosis: datos.dosis,
      via: datos.via as ViaAdministracion,
      hora: datos.hora,
      estado: datos.estado ?? 'Pendiente',
    });
  };

  return (
    <form
      className="formulario-medicamento"
      onSubmit={handleSubmit(enviar)}
      noValidate
    >
      {error && (
        <div className="mensaje mensaje--error" role="alert">
          <span aria-hidden="true">!</span>
          <span>{error}</span>
        </div>
      )}

      <div className="campo">
        <label className="campo__label" htmlFor="paciente-prescripcion">
          Paciente *
        </label>
        <select
          id="paciente-prescripcion"
          className={`campo__control ${errors.paciente ? 'campo__control--error' : ''}`}
          {...register('paciente')}
        >
          <option value="">Selecciona un paciente…</option>
          {pacientes.map((paciente) => (
            <option key={paciente.id} value={paciente.id}>
              {paciente.nombreCompleto} · {paciente.identificador}
              {paciente.cunaIdentificador
                ? ` · Cuna ${paciente.cunaIdentificador}`
                : ''}
            </option>
          ))}
        </select>
        {errors.paciente && (
          <span className="campo__error">{errors.paciente.message}</span>
        )}
      </div>

      <div className="campo-fila">
        <Input
          etiqueta="Medicamento *"
          placeholder="Ej. Ampicilina"
          error={errors.nombre?.message}
          {...register('nombre')}
        />
        <Input
          etiqueta="Dosis prescrita *"
          placeholder="Ej. 50 mg/kg cada 12 h"
          error={errors.dosis?.message}
          {...register('dosis')}
        />
      </div>

      <div className="campo-fila campo-fila--3">
        <div className="campo">
          <label className="campo__label" htmlFor="via">
            Vía *
          </label>
          <select id="via" className="campo__control" {...register('via')}>
            <option value="IV">Intravenosa (IV)</option>
            <option value="IM">Intramuscular (IM)</option>
            <option value="ET">Endotraqueal (ET)</option>
            <option value="VO">Oral (VO)</option>
          </select>
          {errors.via && (
            <span className="campo__error">{errors.via.message}</span>
          )}
        </div>

        <Input
          etiqueta="Hora programada *"
          type="time"
          error={errors.hora?.message}
          {...register('hora')}
        />

        <div className="campo">
          <label className="campo__label" htmlFor="estado-prescripcion">
            Estado inicial
          </label>
          <select
            id="estado-prescripcion"
            className="campo__control"
            {...register('estado')}
          >
            <option value="Pendiente">Pendiente</option>
            <option value="Administrado">Administrado</option>
          </select>
        </div>
      </div>

      <div className="formulario-medicamento__pie">
        <Button variante="secundario" onClick={onCancelar} disabled={guardando}>
          Cancelar
        </Button>
        <Button type="submit" cargando={guardando}>
          Registrar prescripción
        </Button>
      </div>
    </form>
  );
}
