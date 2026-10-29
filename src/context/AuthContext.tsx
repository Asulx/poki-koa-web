/**
 * @file AuthContext.tsx
 * @description Estado global de la sesión clínica. Rehidrata la sesión desde
 * `GET /api/auth/me/` cuando existe un token, expone el ciclo de vida
 * `login`/`logout` y reacciona al evento de sesión expirada emitido por el
 * cliente Axios.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { EVENTO_SESION_EXPIRADA, TOKEN_KEY } from '@/api/axios';
import {
  cerrarSesion as cerrarSesionApi,
  iniciarSesion as iniciarSesionApi,
  obtenerSesion,
} from '@/services/authService';
import type { Credenciales, Perfil, Sesion, Usuario } from '@/types/auth';

/** Estados posibles de la sesión durante el arranque de la aplicación. */
export type EstadoSesion = 'cargando' | 'autenticado' | 'anonimo';

/** Contrato público del contexto de autenticación. */
export interface AuthContextValue {
  /** Estado actual de la sesión. */
  estado: EstadoSesion;
  /** Usuario autenticado o `null`. */
  usuario: Usuario | null;
  /** Perfil clínico asociado al usuario. */
  perfil: Perfil | null;
  /** Token vigente (útil para depuración; el cliente Axios lo lee solo). */
  token: string | null;
  /** Inicia sesión y persiste el token. */
  iniciarSesion: (credenciales: Credenciales) => Promise<Usuario>;
  /** Cierra la sesión local y, si es posible, la remota. */
  cerrarSesion: () => Promise<void>;
  /** Vuelve a consultar `/auth/me/` para refrescar usuario y perfil. */
  recargarSesion: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Elimina del navegador cualquier rastro de la sesión.
 *
 * @returns Nada.
 */
function limpiarAlmacenamiento(): void {
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * Proveedor del contexto de autenticación.
 *
 * @param props - Componentes hijos que consumirán la sesión.
 * @returns Proveedor con el estado y las acciones de sesión.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [estado, setEstado] = useState<EstadoSesion>('cargando');
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_KEY)
  );

  /**
   * Rehidrata la sesión desde el backend usando el token persistido.
   * Si el token ya no es válido, limpia el estado y deja al usuario anónimo.
   *
   * @returns `true` si la sesión quedó autenticada, `false` si no hay token
   * o el servidor lo rechazó.
   */
  const recargarSesion = useCallback(async (): Promise<boolean> => {
    const guardado = localStorage.getItem(TOKEN_KEY);

    if (!guardado) {
      setUsuario(null);
      setPerfil(null);
      setToken(null);
      setEstado('anonimo');
      return false;
    }

    try {
      const sesion = await obtenerSesion();
      setUsuario(sesion.usuario);
      setPerfil(sesion.perfil);
      setToken(guardado);
      setEstado('autenticado');
      return true;
    } catch {
      limpiarAlmacenamiento();
      setUsuario(null);
      setPerfil(null);
      setToken(null);
      setEstado('anonimo');
      return false;
    }
  }, []);

  // Rehidratación inicial y escucha del evento global de sesión expirada.
  useEffect(() => {
    void recargarSesion();

    const alExpirar = () => {
      limpiarAlmacenamiento();
      setUsuario(null);
      setPerfil(null);
      setToken(null);
      setEstado('anonimo');
    };

    window.addEventListener(EVENTO_SESION_EXPIRADA, alExpirar);
    return () => window.removeEventListener(EVENTO_SESION_EXPIRADA, alExpirar);
  }, [recargarSesion]);

  /**
   * Inicia sesión contra la API y deja el contexto en estado autenticado.
   *
   * @param credenciales - Usuario y contraseña del formulario.
   * @returns Usuario autenticado.
   */
  const iniciarSesion = useCallback(
    async (credenciales: Credenciales): Promise<Usuario> => {
      const sesion: Sesion = await iniciarSesionApi(credenciales);
      localStorage.setItem(TOKEN_KEY, sesion.token);
      setUsuario(sesion.usuario);
      setPerfil(sesion.perfil);
      setToken(sesion.token);
      setEstado('autenticado');
      return sesion.usuario;
    },
    []
  );

  /**
   * Cierra la sesión. El borrado local es inmediato incluso si la API falla,
   * para que el usuario nunca quede atrapado en una sesión inválida.
   */
  const cerrarSesion = useCallback(async (): Promise<void> => {
    try {
      await cerrarSesionApi();
    } catch {
      // El token puede haber expirado; la limpieza local es suficiente.
    } finally {
      limpiarAlmacenamiento();
      setUsuario(null);
      setPerfil(null);
      setToken(null);
      setEstado('anonimo');
    }
  }, []);

  const valor = useMemo<AuthContextValue>(
    () => ({
      estado,
      usuario,
      perfil,
      token,
      iniciarSesion,
      cerrarSesion,
      recargarSesion,
    }),
    [
      estado,
      usuario,
      perfil,
      token,
      iniciarSesion,
      cerrarSesion,
      recargarSesion,
    ]
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

/**
 * Hook de acceso al contexto de autenticación.
 *
 * @throws Error si se usa fuera de `AuthProvider`.
 * @returns Contexto de autenticación.
 */
export function useAuth(): AuthContextValue {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>.');
  }
  return contexto;
}
