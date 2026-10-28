import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import './Layout.css';
import Sidebar from './Sidebar';
import Header from './Header';

/**
 * Componente de diseño principal (*Layout*) de la aplicación.
 * Orquesta la estructura general de la interfaz incluyendo la barra lateral de navegación (`Sidebar`),
 * la cabecera superior (`Header`) y el contenedor dinámico para las rutas hijas (`<Outlet />`).
 * Gestiona de manera centralizada el estado de apertura del menú para dispositivos móviles.
 *
 * @returns La estructura contenedora completa de la vista principal del sistema.
 */
export default function MainLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="layout">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

      <div className="main-content">
        <Header onMenuClick={() => setMenuOpen(true)} />

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
