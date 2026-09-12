import { NavLink } from 'react-router-dom'

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <h2>Mi Sistema Poki Koa</h2>

      <nav>
        <ul>
          <li><NavLink to="/">Dashboard</NavLink></li>
          <li><NavLink to="/pacientes">Pacientes</NavLink></li>
          <li><NavLink to="/medicamentos">Medicamentos</NavLink></li>
          <li><NavLink to="/reportes">Reportes</NavLink></li>
          <li><NavLink to="/configuracion">Configuración</NavLink></li>
        </ul>
      </nav>
    </aside>
  )
}