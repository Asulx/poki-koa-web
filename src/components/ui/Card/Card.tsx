import './Card.css'

type CardProps = {
  title: string
  children: React.ReactNode
}

export default function Card({
  title,
  children,
}: CardProps) {
  return (
    <div className="card">
      <div className="card-header">
        <h3>{title}</h3>
      </div>

      <div className="card-body">
        {children}
      </div>
    </div>
  )
}