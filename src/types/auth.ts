/**
 * @file auth.ts
 * @description Contratos de autenticación y perfiles clínicos. La API entrega
 * `snake_case`; las capas de mapeo transforman a `camelCase` para el frontend.
 */

/** Roles clínicos reconocidos por el backend (`PerfilUsuario.Rol`). */
export type Rol = 'administrador' | 'medico' | 'enfermeria';

/** Perfil clínico asociado a un usuario. */
export interface Perfil {
  id: number;
  usuarioId: number;
  rol: Rol | null;
  rolDisplay: string | null;
  turno: string | null;
  nombreCompleto: string;
  iniciales: string;
  creadoEn: string;
  actualizadoEn: string;
}

/** Usuario autenticado expuesto por `/api/auth/me/`. */
export interface Usuario {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  nombreCompleto: string;
  iniciales: string;
  rol: Rol | null;
  rolDisplay: string | null;
  turno: string | null;
  esAdministrador: boolean;
  isSuperuser: boolean;
  isStaff: boolean;
  activo: boolean;
}

/** Sesión completa devuelta por `POST /api/auth/login/`. */
export interface Sesion {
  token: string;
  usuario: Usuario;
  perfil: Perfil | null;
}

/** Sesión rehidratada desde `GET /api/auth/me/` (sin token). */
export type SesionRehidratada = Omit<Sesion, 'token'>;

/** Credenciales del formulario de inicio de sesión. */
export interface Credenciales {
  username: string;
  password: string;
}
