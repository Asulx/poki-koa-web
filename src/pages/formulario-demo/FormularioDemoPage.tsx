import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  demoFormSchema,
  type DemoFormData,
} from '@/forms/schemas/demoFormSchema';

/**
 * Componente de página para el formulario de demostración.
 * Implementa validación robusta de formularios mediante `react-hook-form` y esquemas Zod,
 * gestionando el registro de campos, captura de errores y el envío de datos.
 *
 * @returns Un elemento JSX con la vista y lógica del formulario de demostración.
 */
export default function FormularioDemoPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DemoFormData>({
    resolver: zodResolver(demoFormSchema),
  });

  const onSubmit = (data: DemoFormData) => {
    console.log(data);
    alert('Formulario enviado correctamente');
  };

  return (
    <div>
      <h1>Formulario Demo</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Nombre</label>
          <input {...register('nombre')} />
          {errors.nombre && <p>{errors.nombre.message}</p>}
        </div>

        <div>
          <label>Correo</label>
          <input {...register('correo')} />
          {errors.correo && <p>{errors.correo.message}</p>}
        </div>

        <div>
          <label>Edad</label>
          <input type="number" {...register('edad', { valueAsNumber: true })} />
          {errors.edad && <p>{errors.edad.message}</p>}
        </div>

        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}
