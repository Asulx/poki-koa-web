import { useState } from 'react'
import { Outlet } from 'react-router-dom'

import './Layout.css'
import Sidebar from './Sidebar'
import Header from './Header'

export default function MainLayout() {
  const [menuOpen, setMenuOpen] = useState(false)

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
  )
}