import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  medicamentoSchema,
  type MedicamentoFormData,
} from '@/forms/schemas/medicamentoSchema';

/**
 * Propiedades para el componente MedicamentoForm.
 */
type MedicamentoFormProps = {
  /** Valores iniciales opcionales para rellenar el formulario (útil en modo edición). */
  defaultValues?: Partial<MedicamentoFormData>;
};

/**
 * Componente de formulario para la creación y edición de medicamentos.
 * Utiliza React Hook Form y Zod para la validación de campos, gestionando
 * de manera reactiva los estados de error, carga y habilitación del botón de envío.
 * 
 * @param props Contiene los valores iniciales opcionales (`defaultValues`).
 * @returns Un elemento `<form>` estructurado con campos validados para la gestión de medicamentos.
 */
export default function MedicamentoForm({
  defaultValues,
}: MedicamentoFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<MedicamentoFormData>({
    resolver: zodResolver(medicamentoSchema) as any,
    mode: 'onChange',
    defaultValues,
  });

  const onSubmit = async (data: MedicamentoFormData) => {
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log(data);

    alert('Medicamento guardado correctamente');

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Nombre</label>

        <input {...register('nombre')} placeholder="Paracetamol" />

        {errors.nombre && <p>{errors.nombre.message}</p>}
      </div>

      <div>
        <label>Principio activo</label>

        <input {...register('principioActivo')} placeholder="Paracetamol" />

        {errors.principioActivo && <p>{errors.principioActivo.message}</p>}
      </div>

      <div>
        <label>Dosis (mg)</label>

        <input
          type="number"
          {...register('dosis', {
            valueAsNumber: true,
          })}
        />

        {errors.dosis && <p>{errors.dosis.message}</p>}
      </div>

      <div>
        <label>Stock disponible</label>

        <input
          type="number"
          {...register('stock', {
            valueAsNumber: true,
          })}
        />

        {errors.stock && <p>{errors.stock.message}</p>}
      </div>

      <button type="submit" disabled={!isValid || isLoading}>
        {isLoading ? 'Guardando...' : 'Guardar medicamento'}
      </button>
    </form>
  );
}