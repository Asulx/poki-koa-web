<<<<<<< HEAD
=======
import { useState } from 'react'
>>>>>>> rama-temporal
import { Outlet } from 'react-router-dom'

import './Layout.css'
import Sidebar from './Sidebar'
import Header from './Header'

export default function MainLayout() {
<<<<<<< HEAD
  return (
    <div className="layout">
      <Sidebar />

      <div className="main-content">
        <Header />
=======
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="layout">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

      <div className="main-content">
        <Header onMenuClick={() => setMenuOpen(true)} />
>>>>>>> rama-temporal

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  )
}