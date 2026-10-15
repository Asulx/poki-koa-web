import { useNavigate } from 'react-router-dom'

import { useAuth } from '@/context/AuthContext'

export default function Header() {
  const { usuario, cerrarSesion } = useAuth()
  const navigate = useNavigate()

  const salir = () => {
    cerrarSesion()
    navigate('/login')
  }

  return (
    <header className="header">
      <h1>Panel de Administración</h1>

      <div>
        {usuario?.nombre} ({usuario?.rol}){' '}
        <button onClick={salir}>Cerrar sesión</button>
      </div>
    </header>
  )
}