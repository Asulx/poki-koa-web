import { createContext, useContext, useState, type ReactNode } from "react";

import { TOKEN_KEY } from "@/services/api";
import { login } from "@/services/authService";
import type { Usuario } from "@/types/auth";

const USUARIO_KEY = "pokikoa_usuario";

type AuthContextType = {
  usuario: Usuario | null;
  iniciarSesion: (username: string, password: string) => Promise<void>;
  cerrarSesion: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

function leerUsuarioGuardado(): Usuario | null {
  try {
    const texto = localStorage.getItem(USUARIO_KEY);
    return texto ? (JSON.parse(texto) as Usuario) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(leerUsuarioGuardado);

  const iniciarSesion = async (username: string, password: string) => {
    // 1. Comentamos la llamada real al backend
    // const { token, ...datosUsuario } = await login(username, password)

    // 2. Simulamos una respuesta exitosa del backend
    const token = "token-falso-12345";
    const datosUsuario = {
      id: 1,
      username: username || "usuario_prueba",
      email: "admin@pokikoa.com",
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

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return contexto;
}
