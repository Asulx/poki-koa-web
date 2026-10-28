import './Input.css';

/**
 * Propiedades de configuración para el componente Input.
 */
type InputProps = {
  /** Etiqueta de texto opcional que se muestra encima del campo de entrada. */
  label?: string;
  /** Texto de sugerencia o marcador de posición dentro del input. */
  placeholder?: string;
  /** Valor actual del campo de texto controlado. */
  value?: string;
  /** Mensaje de error de validación que se muestra debajo del campo en caso de haber fallos. */
  error?: string;
  /** Función callback que se ejecuta al cambiar el valor del input. */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

/**
 * Componente de campo de entrada de texto reutilizable.
 * Soporta etiquetas opcionales, marcadores de posición, valores controlados,
 * eventos de cambio y visualización de mensajes de error de validación.
 * 
 * @param props Contiene las propiedades de configuración y eventos del input.
 * @returns Un contenedor `div` que agrupa la etiqueta, el input de texto y el mensaje de error opcional.
 */
export default function Input({
  label,
  placeholder,
  value,
  error,
  onChange,
}: InputProps) {
  return (
    <div className="input-container">
      {label && <label>{label}</label>}

      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />

      {error && <span className="input-error">{error}</span>}
    </div>
  );
}