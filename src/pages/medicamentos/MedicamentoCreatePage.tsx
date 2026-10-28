import MedicamentoForm from '@/components/medicamentos/MedicamentoForm';

/**
 * Componente de página para el registro de nuevos medicamentos en el sistema.
 * Renderiza el encabezado principal y el formulario estructurado de gestión farmacéutica.
 * 
 * @returns Un elemento JSX con la vista completa de registro de medicamentos.
 */
export default function MedicamentoCreatePage() {
  return (
    <>
      <h1>Registrar Medicamento</h1>
      <MedicamentoForm />
    </>
  );
}