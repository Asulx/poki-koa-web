import { useNavigate } from 'react-router-dom';

import PacienteForm from '@/components/pacientes/PacienteForm';
import { pacientesService } from '@/services/pacientesService';

import type { PacienteFormData } from '@/forms/schemas/pacienteSchema';

/**
 * Componente de página para el registro de un nuevo paciente en el sistema.
 * Gestiona la lógica de envío de datos del formulario, la comunicación con el servicio de pacientes,
 * el manejo de excepciones y la redirección al listado general tras un registro exitoso.
 * 
 * @returns Un elemento JSX que representa la vista completa de registro de pacientes.
 */
export default function PacienteCreatePage() {
  const navigate = useNavigate();

  const handleCreate = async (data: PacienteFormData) => {
    try {
      await pacientesService.crear(data);

      alert('Paciente registrado correctamente');

      navigate('/pacientes');
    } catch (error) {
      console.error('Error al registrar paciente:', error);

      alert('No fue posible registrar el paciente.');
    }
  };

  return (
    <>
      <h1>Registrar Paciente</h1>

      <PacienteForm onSubmit={handleCreate} />
    </>
  );
}