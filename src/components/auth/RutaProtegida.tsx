/**
 * @file RutaProtegida.tsx
 * @description Guarda de rutas: espera la rehidratación de la sesión, exige
 * autenticación y, opcionalmente, restringe el acceso por rol clínico.
 */

import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuth } from '@/context/AuthContext';
import type { Rol } from '@/types/auth';
import { esAdministrador } from '@/utils/roles';

/** Propiedades del guardián de rutas. */
interface Props {
  /** Roles autorizados. Si se omite, basta con tener sesión activa. */
  roles?: Rol[];
}

/**
 * Comprueba si el rol efectivo está dentro de los permitidos. Un
 * superusuario siempre se considera administrador aunque no tenga perfil
 * clínico asignado.
 *
 * @param rol - Rol del usuario autenticado.
 * @param roles - Roles autorizados.
 * @param administrador - Indica si la cuenta tiene privilegios de admin.
 * @returns `true` si la ruta es accesible.
 */
function rolAutorizado(
  rol: Rol | null,
  roles: Rol[],
  administrador: boolean
): boolean {
  if (rol && roles.includes(rol)) return true;
  return administrador && roles.includes('administrador');
}

/**
 * Envuelve las rutas privadas de la aplicación.
 *
 * @param props - Lista opcional de roles autorizados.
 * @returns `Outlet` si hay permiso, pantalla de carga o redirección si no.
 */
export default function RutaProtegida({ roles }: Props) {
  const { estado, usuario } = useAuth();
  const ubicacion = useLocation();

  if (estado === 'cargando') {
    return (
      <div className="cargando" aria-busy="true">
        <span className="spinner" aria-hidden="true" />
        <p>Verificando sesión…</p>
      </div>
    );
  }

  if (estado !== 'autenticado' || !usuario) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ desde: `${ubicacion.pathname}${ubicacion.search}` }}
      />
    );
  }

  if (roles && !rolAutorizado(usuario.rol, roles, esAdministrador(usuario))) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
