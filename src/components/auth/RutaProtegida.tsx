import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";
import type { Rol } from "@/types/auth";

type Props = {
  roles?: Rol[]; // si no se indica, basta con haber iniciado sesión
};

// Guarda de rutas: sin sesión -> /login; con rol equivocado -> inicio.
// Ojo: esto es solo comodidad de UI. La seguridad real está en los permisos del backend.
export default function RutaProtegida({ roles }: Props) {
  const { usuario } = useAuth();

  if (!usuario) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(usuario.rol)) return <Navigate to="/" replace />;

  return <Outlet />;
}
