import MedicamentoForm from '@/components/medicamentos/MedicamentoForm';

/**
 * Componente de página para la edición de medicamentos existentes en el sistema.
 * Carga los datos de demostración o del recurso seleccionado e inicializa el formulario farmacéutico.
 * 
 * @returns Un elemento JSX con la vista de edición de medicamentos.
 */
export default function MedicamentoEditPage() {
  const medicamentoDemo = {
    nombre: 'Paracetamol',
    principioActivo: 'Paracetamol',
    dosis: 500,
    stock: 120,
  };

  return (
    <>
      <h1>Editar Medicamento</h1>

      <MedicamentoForm defaultValues={medicamentoDemo} />
    </>
  );
}