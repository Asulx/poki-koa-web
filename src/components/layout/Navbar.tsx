import { NavLink } from 'react-router-dom';

/**
 * Componente de barra de navegación principal de la aplicación.
 * Proporciona enlaces de acceso directo hacia las vistas clave del sistema:
 * Dashboard, Pacientes, Medicamentos, Reportes y Configuración.
 * 
 * @returns Un elemento `<nav>` con los enlaces de navegación estructurados.
 */
export default function Navbar() {
  return (
    <nav>
      <NavLink to="/">Dashboard</NavLink> |{' '}
      <NavLink to="/pacientes">Pacientes</NavLink> |{' '}
      <NavLink to="/medicamentos">Medicamentos</NavLink> |{' '}
      <NavLink to="/reportes">Reportes</NavLink> |{' '}
      <NavLink to="/configuracion">Configuración</NavLink>
    </nav>
  );
}