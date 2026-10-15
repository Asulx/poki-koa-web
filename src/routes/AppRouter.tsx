import { BrowserRouter, Routes, Route } from 'react-router-dom'

import MainLayout from '@/components/layout/MainLayout'
import RutaProtegida from '@/components/auth/RutaProtegida'

import LoginPage from '@/pages/login/LoginPage'
import DashboardPage from '@/pages/dashboard/DashboardPage'
import PacientesPage from '@/pages/pacientes/PacientesPage'
import PacienteCreatePage from '@/pages/pacientes/PacienteCreatePage'
import PacienteEditPage from '@/pages/pacientes/PacienteEditPage'
import MedicamentosPage from '@/pages/medicamentos/MedicamentosPage'
import MedicamentoEditPage from '@/pages/medicamentos/MedicamentoEditPage'
import ReportesPage from '@/pages/reportes/ReportesPage'
import ConfiguracionPage from '@/pages/configuracion/ConfiguracionPage'
import ComponentesDemoPage from '@/pages/ComponentesDemoPage'
import FormularioDemoPage from '@/pages/formulario-demo/FormularioDemoPage'
import TurnosPage from '@/pages/turnos/TurnosPage'
import MisCunasPage from '@/pages/turnos/MisCunasPage'
import PortalApoderadoPage from '@/pages/portal/PortalApoderadoPage'
import { NotFoundPage } from '@/pages/notfound/NotFoundPage'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Todo lo de abajo exige haber iniciado sesión */}
        <Route element={<RutaProtegida />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<DashboardPage />} />

            {/* Solo personal clínico */}
            <Route element={<RutaProtegida roles={['jefe', 'medico', 'enfermero']} />}>
              <Route path="/pacientes" element={<PacientesPage />} />
              <Route path="/pacientes/nuevo" element={<PacienteCreatePage />} />
              <Route path="/pacientes/editar" element={<PacienteEditPage />} />
              <Route path="/medicamentos" element={<MedicamentosPage />} />
              <Route path="/medicamentos/editar" element={<MedicamentoEditPage />} />
              <Route path="/medicamentos/editar/:id" element={<MedicamentoEditPage />} />
              <Route path="/reportes" element={<ReportesPage />} />
              <Route path="/mis-cunas" element={<MisCunasPage />} />
            </Route>

            {/* Solo jefatura / administración */}
            <Route element={<RutaProtegida roles={['jefe', 'admin']} />}>
              <Route path="/turnos" element={<TurnosPage />} />
              <Route path="/configuracion" element={<ConfiguracionPage />} />
              <Route path="/componentes" element={<ComponentesDemoPage />} />
              <Route path="/formulario-demo" element={<FormularioDemoPage />} />
            </Route>

            {/* Solo apoderados */}
            <Route element={<RutaProtegida roles={['apoderado']} />}>
              <Route path="/portal" element={<PortalApoderadoPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}