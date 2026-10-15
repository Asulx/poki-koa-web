import { NavLink } from 'react-router-dom'
<<<<<<< HEAD

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
=======
import './Sidebar.css'

interface NavItem {
  label: string
  to: string
  icon: string // path de un SVG de 24x24
  end?: boolean
}

interface NavGroup {
  title: string
  items: NavItem[]
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: 'Principal',
    items: [
      { label: 'Dashboard', to: '/', end: true, icon: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z' },
      {
        label: 'Pacientes',
        to: '/pacientes',
        icon: 'M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M8.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM20 8v6M23 11h-6',
      },
      {
        label: 'Medicamentos',
        to: '/medicamentos',
        icon: 'M10.5 20.5l-7-7a5 5 0 0 1 7-7l7 7a5 5 0 0 1-7 7zM8.5 8.5l7 7',
      },
    ],
  },
  {
    title: 'Gestión',
    items: [
      {
        label: 'Reportes',
        to: '/reportes',
        icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8',
      },
    ],
  },
  {
    title: 'Sistema',
    items: [
      {
        label: 'Configuración',
        to: '/configuracion',
        icon: 'M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6',
      },
    ],
  },
]

interface SidebarProps {
  open?: boolean
  onClose?: () => void
}

export default function Sidebar({ open = false, onClose }: SidebarProps) {
  return (
    <>
      {open && <div className="sidebar-overlay" onClick={onClose} aria-hidden="true" />}

      <aside className={`sidebar${open ? ' sidebar--open' : ''}`} aria-label="Navegación principal">
        <div className="sidebar-brand">
          <div className="sidebar-logo" aria-hidden="true">PK</div>
          <div>
            <p className="sidebar-brand-name">Poki Koa</p>
            <p className="sidebar-brand-sub">Neonatología</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {NAV_GROUPS.map((group) => (
            <div className="sidebar-group" key={group.title}>
              <p className="sidebar-group-title">{group.title}</p>
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `sidebar-link${isActive ? ' sidebar-link--active' : ''}`
                  }
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d={item.icon} />
                  </svg>
                  {item.label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-user">
          <div className="sidebar-avatar" aria-hidden="true">EN</div>
          <div className="sidebar-user-info">
            <p className="sidebar-user-name">Enfermera de turno</p>
            <p className="sidebar-user-shift">
              <span className="sidebar-online-dot" aria-hidden="true" />
              En línea · Turno Mañana
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}
>>>>>>> rama-temporal
