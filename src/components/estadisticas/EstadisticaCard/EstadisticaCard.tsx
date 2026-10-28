import './EstadisticaCard.css';

/**
 * Propiedades requeridas y opcionales para el componente EstadisticaCard.
 */
type EstadisticaCardProps = {
  /** Título descriptivo de la métrica mostrada. */
  titulo: string;
  /** Valor numérico principal de la estadística. */
  valor: number;
  /** Descripción secundaria o contexto opcional de la métrica. */
  descripcion?: string;
};

/**
 * Componente de tarjeta para visualizar métricas o estadísticas resumidas en la interfaz.
 *
 * @param props Contiene el título, el valor numérico y una descripción opcional.
 * @returns Un elemento `<article>` estructurado con la información estadística.
 */
export default function EstadisticaCard({
  titulo,
  valor,
  descripcion,
}: EstadisticaCardProps) {
  return (
    <article className="estadistica-card">
      <h3 className="estadistica-card__titulo">{titulo}</h3>

      <p className="estadistica-card__valor">{valor}</p>

      {descripcion && (
        <p className="estadistica-card__descripcion">{descripcion}</p>
      )}
    </article>
  );
}
