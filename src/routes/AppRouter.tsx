import { BrowserRouter, Routes, Route } from 'react-router-dom'

import DashboardPage from '@/pages/dashboard/DashboardPage'
import PacientesPage from '@/pages/pacientes/PacientesPage'
import MedicamentosPage from '@/pages/medicamentos/MedicamentosPage'
import ReportesPage from '@/pages/reportes/ReportesPage'
import ConfiguracionPage from '@/pages/configuracion/ConfiguracionPage'
import NotFoundPage from '@/pages/notfound/NotFoundPage'
import Navbar from '@/components/layout/Navbar'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/pacientes" element={<PacientesPage />} />
        <Route path="/medicamentos" element={<MedicamentosPage />} />
        <Route path="/reportes" element={<ReportesPage />} />
        <Route path="/configuracion" element={<ConfiguracionPage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
