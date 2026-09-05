import { NavLink } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav>
      <NavLink to="/">Dashboard</NavLink> |{' '}
      <NavLink to="/pacientes">Pacientes</NavLink> |{' '}
      <NavLink to="/medicamentos">Medicamentos</NavLink> |{' '}
      <NavLink to="/reportes">Reportes</NavLink> |{' '}
      <NavLink to="/configuracion">Configuración</NavLink>
    </nav>
  )
}