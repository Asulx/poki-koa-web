import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '@/context/AuthContext';
import type { Rol } from '@/types/auth';

/**
 * Propiedades para el componente de guardián de rutas protegidas.
 */
type Props = {
  /**
   * Lista opcional de roles permitidos para acceder a la ruta.
   * Si no se especifica, solo se requiere estar autenticado.
   */
  roles?: Rol[];
};

/**
 * Guardián de rutas para controlar el acceso según el estado de autenticación y rol del usuario.
 * Redirige a `/login` si no hay sesión activa o al inicio `/` si el usuario no posee un rol autorizado.
 *
 * @param props Contiene la lista opcional de roles autorizados.
 * @returns El componente de la ruta anidada (`<Outlet />`) si cumple los permisos, o un componente de redirección (`<Navigate />`).
 */
export default function RutaProtegida({ roles }: Props) {
  const { usuario } = useAuth();

  if (!usuario) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(usuario.rol)) return <Navigate to="/" replace />;

  return <Outlet />;
}
