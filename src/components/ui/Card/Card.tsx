import './Card.css';

/**
 * Propiedades requeridas para el componente Card.
 */
type CardProps = {
  /** Título principal que se mostrará en la cabecera de la tarjeta. */
  title: string;
  /** Contenido interno o elementos hijos que se renderizarán en el cuerpo de la tarjeta. */
  children: React.ReactNode;
};

/**
 * Componente contenedor de tipo Tarjeta (*Card*).
 * Organiza visualmente la información estructurándola en una cabecera con título
 * y un cuerpo flexible para albergar diversos componentes o contenidos.
 * 
 * @param props Contiene el título de la tarjeta y los nodos hijos.
 * @returns Un contenedor HTML estilizado en forma de tarjeta.
 */
export default function Card({ title, children }: CardProps) {
  return (
    <div className="card">
      <div className="card-header">
        <h3>{title}</h3>
      </div>

      <div className="card-body">{children}</div>
    </div>
  );
}