import './Button.css'

type ButtonProps = {
  variant?: 'primary' | 'secondary'
  disabled?: boolean
<<<<<<< HEAD
=======
  onClick?: () => void
>>>>>>> rama-temporal
  children: React.ReactNode
}

export default function Button({
  variant = 'primary',
  disabled = false,
<<<<<<< HEAD
=======
  onClick,
>>>>>>> rama-temporal
  children,
}: ButtonProps) {
  return (
    <button
      className={`button ${variant}`}
      disabled={disabled}
<<<<<<< HEAD
=======
      onClick={onClick}
>>>>>>> rama-temporal
    >
      {children}
    </button>
  )
}