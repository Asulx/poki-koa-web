import { createContext, useContext, useState, type ReactNode } from 'react';

import { TOKEN_KEY } from '@/services/api';
import { login } from '@/services/authService';
import type { Usuario } from '@/types/auth';

/** Clave empleada para almacenar la sesión del usuario en localStorage. */
const USUARIO_KEY = 'pokikoa_usuario';

/**
 * Define la estructura del contexto de autenticación de la aplicación.
 */
type AuthContextType = {
  /** Usuario actualmente autenticado, o `null` si no hay sesión activa. */
  usuario: Usuario | null;
  /** Función asíncrona para iniciar sesión con credenciales de usuario. */
  iniciarSesion: (username: string, password: string) => Promise<void>;
  /** Función para cerrar la sesión actual y limpiar el almacenamiento local. */
  cerrarSesion: () => void;
};

/** Instancia del contexto de autenticación de React. */
const AuthContext = createContext<AuthContextType | null>(null);

/**
 * Lee y deserializa el usuario guardado previamente en el almacenamiento local.
 *
 * @returns El objeto de tipo `Usuario` si existe y es válido, de lo contrario `null`.
 */
function leerUsuarioGuardado(): Usuario | null {
  try {
    const texto = localStorage.getItem(USUARIO_KEY);
    return texto ? (JSON.parse(texto) as Usuario) : null;
  } catch {
    return null;
  }
}

/**
 * Proveedor del contexto de autenticación (*Provider*).
 * Gestiona el estado reactivo de sesión del usuario y su persistencia en el almacenamiento local.
 *
 * @param props Contiene los elementos hijos de React que consumirán el contexto.
 * @returns El proveedor de contexto envolviendo a los componentes hijos.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(leerUsuarioGuardado);

  const iniciarSesion = async (username: string, password: string) => {
    // 1. Comentamos la llamada real al backend
    // const { token, ...datosUsuario } = await login(username, password)

    // 2. Simulamos una respuesta exitosa del backend
    const token = 'token-falso-12345';
    const datosUsuario = {
      id: 1,
      username: username || 'usuario_prueba',
      email: 'admin@pokikoa.com',
    } as unknown as Usuario;

    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USUARIO_KEY, JSON.stringify(datosUsuario));
    setUsuario(datosUsuario);
  };

  const cerrarSesion = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USUARIO_KEY);
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, iniciarSesion, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook personalizado para consumir de manera segura el contexto de autenticación.
 *
 * @throws {Error} Si es invocado fuera de un componente envuelto por `AuthProvider`.
 * @returns El objeto con el estado y los métodos de autenticación del contexto.
 */
export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return contexto;
}
