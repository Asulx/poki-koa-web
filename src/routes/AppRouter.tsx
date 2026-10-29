/**
 * @file AppRouter.tsx
 * @description Configuración de rutas de Poki Koa. El acceso es público; el
 * resto de pantallas quedan bajo el guardián de sesión y el layout privado.
 * La bitácora y sus vistas derivadas exigen rol administrador.
 */

import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import RutaProtegida from '@/components/auth/RutaProtegida';
import MainLayout from '@/components/layout/MainLayout';
import Spinner from '@/components/ui/Spinner/Spinner';
import LoginPage from '@/pages/login/LoginPage';
import NotFoundPage from '@/pages/notfound/NotFoundPage';

/**
 * Las pantallas privadas se cargan bajo demanda para que el paquete inicial
 * solo incluya el acceso y el layout. Cada módulo (incluido Recharts en el
 * panel y los reportes) llega en su propio fragmento.
 */
const DashboardPage = lazy(() => import('@/pages/dashboard/DashboardPage'));
const MapaCunasPage = lazy(() => import('@/pages/mapa/MapaCunasPage'));
const MisCunasPage = lazy(() => import('@/pages/turnos/MisCunasPage'));
const PacientesPage = lazy(() => import('@/pages/pacientes/PacientesPage'));
const PacienteFormPage = lazy(
  () => import('@/pages/pacientes/PacienteFormPage')
);
const PacienteDetallePage = lazy(
  () => import('@/pages/pacientes/PacienteDetallePage')
);
const MedicamentosPage = lazy(
  () => import('@/pages/medicamentos/MedicamentosPage')
);
const PlanesPage = lazy(() => import('@/pages/planes/PlanesPage'));
const AlertasPage = lazy(() => import('@/pages/alertas/AlertasPage'));
const TurnosPage = lazy(() => import('@/pages/turnos/TurnosPage'));
const ReportesPage = lazy(() => import('@/pages/reportes/ReportesPage'));
const RegistrosPage = lazy(() => import('@/pages/registros/RegistrosPage'));
const ConfiguracionPage = lazy(
  () => import('@/pages/configuracion/ConfiguracionPage')
);

/**
 * Árbol de rutas de la aplicación.
 *
 * @returns Enrutador con pantallas públicas, privadas y 404.
 */
export default function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Spinner bloque texto="Cargando la aplicación…" />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route element={<RutaProtegida />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/mapa" element={<MapaCunasPage />} />
              <Route path="/mis-cunas" element={<MisCunasPage />} />

              <Route path="/pacientes" element={<PacientesPage />} />
              <Route path="/pacientes/nuevo" element={<PacienteFormPage />} />
              <Route path="/pacientes/:id" element={<PacienteDetallePage />} />
              <Route
                path="/pacientes/:id/editar"
                element={<PacienteFormPage />}
              />

              <Route path="/medicamentos" element={<MedicamentosPage />} />
              <Route path="/planes" element={<PlanesPage />} />
              <Route path="/alertas" element={<AlertasPage />} />
              <Route path="/turnos" element={<TurnosPage />} />
              <Route path="/reportes" element={<ReportesPage />} />
              <Route path="/configuracion" element={<ConfiguracionPage />} />

              <Route element={<RutaProtegida roles={['administrador']} />}>
                <Route path="/registros" element={<RegistrosPage />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
