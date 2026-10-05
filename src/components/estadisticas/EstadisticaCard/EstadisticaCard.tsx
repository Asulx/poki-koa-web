import './EstadisticaCard.css'

type EstadisticaCardProps = {
  titulo: string
  valor: number
  descripcion?: string
}

export default function EstadisticaCard({
  titulo,
  valor,
  descripcion,
}: EstadisticaCardProps) {
  return (
    <article className="estadistica-card">
      <h3 className="estadistica-card__titulo">
        {titulo}
      </h3>

      <p className="estadistica-card__valor">
        {valor}
      </p>

      {descripcion && (
        <p className="estadistica-card__descripcion">
          {descripcion}
        </p>
      )}
    </article>
  )
}