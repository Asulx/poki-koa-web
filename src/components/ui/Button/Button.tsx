import './Button.css'

type ButtonProps = {
  variant?: 'primary' | 'secondary'
  disabled?: boolean
  onClick?: () => void
  children: React.ReactNode
}

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
  )
}