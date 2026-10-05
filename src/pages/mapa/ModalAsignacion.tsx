import { useState } from 'react';
import type { Cuna } from '@/types/cuna';
import './ModalAsignacion.css';

interface ModalAsignacionProps {
  cuna: Cuna;
  onClose: () => void;
  onAsignar: (pacienteNombre: string) => void;
}

export default function ModalAsignacion({ cuna, onClose, onAsignar }: ModalAsignacionProps) {
  const [nombrePaciente, setNombrePaciente] = useState('');

  const manejarEnvio = (e: React.FormEvent) => {
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