import PacienteForm, { type PacienteFormData } from '@/components/pacientes/PacienteForm';

export default function PacientesPage() {
    
    // Función que simula el envío a la base de datos
    const handleGuardarPaciente = (datos: PacienteFormData) => {
        console.log("Enviando paciente a la base de datos:", datos);
        alert(`¡Paciente ${datos.nombre} registrado con éxito!`);
        // Aquí conectaremos con el servicio real (Issue #21) más adelante
    };

    return (
        <div className="p-6">
            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 'bold' }}>Agregar Bebé</h1>
                <p style={{ margin: 0, color: 'gray' }}>Registro de nuevo paciente en la unidad</p>
            </header>

            <PacienteForm onSubmit={handleGuardarPaciente} />
        </div>
    );
}