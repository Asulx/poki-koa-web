import { useState, type FormEvent } from 'react';
import type { Cuna } from '@/types/cuna';
import './ModalAsignacion.css';

/**
 * Propiedades requeridas para el componente {@link ModalAsignacion}.
 */
interface ModalAsignacionProps {
  /** Objeto de la cuna a la cual se le asignará el paciente. */
  cuna: Cuna;
  /** Función callback ejecutada al cerrar o cancelar el modal. */
  onClose: () => void;
  /** Función callback ejecutada al confirmar la asignación, recibiendo el nombre del paciente. */
  onAsignar: (pacienteNombre: string) => void;
}

/**
 * Componente de ventana modal para la asignación de pacientes a una cuna específica
 * dentro de la unidad de neonatología. Gestiona el estado local del formulario de ingreso.
 * 
 * @param props - Propiedades del componente {@link ModalAsignacionProps}.
 * @returns Un elemento JSX con la estructura y lógica de la ventana modal.
 */
export default function ModalAsignacion({
  cuna,
  onClose,
  onAsignar,
}: ModalAsignacionProps) {
  const [nombrePaciente, setNombrePaciente] = useState('');

  const manejarEnvio = (e: FormEvent) => {
    e.preventDefault();
    if (nombrePaciente.trim()) {
      onAsignar(nombrePaciente);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-contenedor">
        <div className="modal-header">
          <h3>Asignar Paciente</h3>
          <span className="modal-cuna-id">{cuna.id}</span>
        </div>

        <form onSubmit={manejarEnvio} className="modal-cuerpo">
          <label htmlFor="paciente">Nombre del Recién Nacido Registrado:</label>
          <input
            type="text"
            id="paciente"
            placeholder="Ej. Juan Pérez"
            value={nombrePaciente}
            onChange={(e) => setNombrePaciente(e.target.value)}
            autoFocus
            required
          />

          <div className="modal-acciones">
            <button type="button" className="btn-cancelar" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-asignar">
              Confirmar Asignación
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}