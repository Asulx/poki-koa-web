import './Button.css';

/**
 * Propiedades de configuración para el componente Button.
 */
type ButtonProps = {
  /** Variante visual del botón. Por defecto es 'primary'. */
  variant?: 'primary' | 'secondary';
  /** Indica si el botón se encuentra inhabilitado para la interacción. */
  disabled?: boolean;
  /** Función callback que se ejecuta al hacer clic sobre el botón. */
  onClick?: () => void;
  /** Contenido interno del botón (texto, íconos o nodos de React). */
  children: React.ReactNode;
};

/**
 * Componente de botón reutilizable de la interfaz de usuario.
 * Soporta variantes de diseño, estados de deshabilitación y manejo de eventos de clic.
 *
 * @param props Contiene la configuración visual, el estado y los hijos del botón.
 * @returns Un elemento `<button>` estilizado según los parámetros definidos.
 */
export default function Button({
  variant = 'primary',
  disabled = false,
  onClick,
  children,
}: ButtonProps) {
  return (
    <button
      className={`button ${variant}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
