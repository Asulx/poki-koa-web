import './Modal.css';

/**
 * Propiedades requeridas para el componente Modal.
 */
type ModalProps = {
  /** Controla si el modal se encuentra abierto y visible en pantalla. */
  isOpen: boolean;
  /** Función callback que se ejecuta para cerrar la ventana modal. */
  onClose: () => void;
  /** Contenido interno que se renderizará dentro del cuerpo del modal. */
  children: React.ReactNode;
};

/**
 * Componente de ventana modal reutilizable.
 * Implementa el patrón de retorno temprano para ocultarse cuando no está activo,
 * un fondo semitransparente (*overlay*) para cerrar al hacer clic fuera,
 * y prevención de propagación de eventos para proteger el contenido interno.
 *
 * @param props Contiene el estado de visibilidad, la función de cierre y los nodos hijos.
 * @returns El contenedor superpuesto del modal o `null` si está cerrado.
 */
export default function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {children}

        <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
}
