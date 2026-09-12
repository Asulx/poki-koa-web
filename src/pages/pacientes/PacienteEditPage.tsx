import PacienteForm from '@/components/pacientes/PacienteForm'

export default function PacienteEditPage() {
  const pacienteDemo = {
    nombre: 'Matías González',
    fechaNacimiento: '2026-09-02',
    sexo: 'Masculino',
    edadGestacional: '38',
    peso: 3.2,
    numeroCuna: 'Cuna 04',
    fechaIngreso: '2026-09-05',
    medicoResponsable: 'Dr. Pérez',
    diagnostico: 'Prematuro estable',
    estadoCanula: 'OK',
    viaIntravenosa: 'Activa',
    observaciones: 'Paciente estable',
  }

  return (
    <>
      <h1>Editar Paciente</h1>

      <PacienteForm
        defaultValues={pacienteDemo}
      />
    </>
  )
}