import './Input.css'

type InputProps = {
  label?: string
  placeholder?: string
  value?: string
  error?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

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

      {error && (
        <span className="input-error">
          {error}
        </span>
      )}
    </div>
  )
}