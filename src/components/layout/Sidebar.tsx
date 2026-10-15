import { NavLink } from 'react-router-dom'

import { useAuth } from '@/context/AuthContext'

export default function Sidebar() {
  const { usuario } = useAuth()
  const rol = usuario?.rol

  // Cada grupo de enlaces depende del rol (solo para la UI; el backend valida igual)
  const esClinico = rol === 'jefe' || rol === 'medico' || rol === 'enfermero'
  const esJefatura = rol === 'jefe' || rol === 'admin'

  return (
    <aside className="sidebar">
      <h2>Mi Sistema Poki Koa</h2>

      <nav>
        <ul>
          {rol !== 'apoderado' && (
            <li><NavLink to="/">Dashboard</NavLink></li>
          )}
          {esClinico && (
            <>
              <li><NavLink to="/pacientes">Pacientes</NavLink></li>
              <li><NavLink to="/medicamentos">Medicamentos</NavLink></li>
              <li><NavLink to="/mis-cunas">Mis cunas</NavLink></li>
              <li><NavLink to="/reportes">Reportes</NavLink></li>
            </>
          )}
          {esJefatura && (
            <>
              <li><NavLink to="/turnos">Turnos</NavLink></li>
              <li><NavLink to="/configuracion">Configuración</NavLink></li>
            </>
          )}
          {rol === 'apoderado' && (
            <li><NavLink to="/portal">Mi bebé</NavLink></li>
          )}
        </ul>
      </nav>
    </aside>
  )
}