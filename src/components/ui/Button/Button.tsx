import './Button.css'

type ButtonProps = {
  variant?: 'primary' | 'secondary'
  disabled?: boolean
  children: React.ReactNode
}

export default function Button({
  variant = 'primary',
  disabled = false,
  children,
}: ButtonProps) {
  return (
    <button
      className={`button ${variant}`}
      disabled={disabled}
    >
      {children}
    </button>
  )
}