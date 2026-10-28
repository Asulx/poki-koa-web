/**
 * @file App.tsx
 * @description Componente raíz de la aplicación que integra el proveedor de autenticación
 * y el enrutador principal de vistas.
 */

import AppRouter from '@/routes/AppRouter';
import { AuthProvider } from '@/context/AuthContext';

/**
 * Componente principal que inicializa el contexto de autenticación y el sistema de rutas.
 *
 * @returns Elemento JSX que representa la estructura raíz de la aplicación
 */
function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
