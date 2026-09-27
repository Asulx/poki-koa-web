import {
    BrowserRouter,
    Routes,
    Route
} from 'react-router-dom'

import MainLayout from '@/components/layout/MainLayout'

import DashboardPage from '@/pages/dashboard/DashboardPage'
import PacientesPage from '@/pages/pacientes/PacientesPage'
import PacienteCreatePage from '@/pages/pacientes/PacienteCreatePage'
import PacienteEditPage from '@/pages/pacientes/PacienteEditPage'

import MedicamentosPage from '@/pages/medicamentos/MedicamentosPage'
import MedicamentoCreatePage from '@/pages/medicamentos/MedicamentoCreatePage'
import MedicamentoEditPage from '@/pages/medicamentos/MedicamentoEditPage'

import ReportesPage from '@/pages/reportes/ReportesPage'
import ConfiguracionPage from '@/pages/configuracion/ConfiguracionPage'
import { NotFoundPage } from '@/pages/notfound/NotFoundPage'

import ComponentesDemoPage from '@/pages/ComponentesDemoPage'
import FormularioDemoPage from '@/pages/formulario-demo/FormularioDemoPage'

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>

                <Route element={<MainLayout />}>

                    <Route
                        path="/"
                        element={<DashboardPage />}
                    />

                    <Route
                        path="/pacientes"
                        element={<PacientesPage />}
                    />

                    <Route
                        path="/pacientes/nuevo"
                        element={<PacienteCreatePage />}
                    />

                    <Route
                        path="/pacientes/editar/:id"
                        element={<PacienteEditPage />}
                    />

                    <Route
                        path="/medicamentos"
                        element={<MedicamentosPage />}
                    />

                    <Route
                        path="/medicamentos/nuevo"
                        element={<MedicamentoCreatePage />}
                    />

                    <Route
                        path="/medicamentos/editar/:id"
                        element={<MedicamentoEditPage />}
                    />

                    <Route
                        path="/reportes"
                        element={<ReportesPage />}
                    />

                    <Route
                        path="/configuracion"
                        element={<ConfiguracionPage />}
                    />

                    <Route
                        path="/componentes"
                        element={<ComponentesDemoPage />}
                    />

                    <Route
                        path="/formulario-demo"
                        element={<FormularioDemoPage />}
                    />

                </Route>

                <Route
                    path="*"
                    element={<NotFoundPage />}
                />

            </Routes>
        </BrowserRouter>
    )
}