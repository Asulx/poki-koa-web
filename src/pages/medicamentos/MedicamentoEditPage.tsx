import MedicamentoForm from '@/components/medicamentos/MedicamentoForm'

export default function MedicamentoEditPage() {
  const medicamentoDemo = {
    nombre: 'Paracetamol',
    principioActivo: 'Paracetamol',
    dosis: 500,
    stock: 120,
  }

  return (
    <>
      <h1>Editar Medicamento</h1>

      <MedicamentoForm
        defaultValues={medicamentoDemo}
      />
    </>
  )
}