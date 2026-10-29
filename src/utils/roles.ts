/**
 * @file roles.ts
 * @description Reglas de autorización de la interfaz. El backend es la
 * autoridad final; estas funciones solo ocultan acciones no permitidas y
 * evitan que el usuario llegue a pantallas que no puede operar.
 */

import type { Perfil, Rol, Usuario } from '@/types/auth';

/** Etiquetas legibles de cada rol clínico. */
const ETIQUETAS_ROL: Record<Rol, string> = {
  administrador: 'Administrador',
  medico: 'Médico',
  enfermeria: 'Enfermería',
};

/**
 * Devuelve la etiqueta legible de un rol.
 *
 * @param rol - Rol clínico o `null`.
 * @returns Etiqueta en español o `Sin rol`.
 */
export function etiquetaRol(rol: Rol | null | undefined): string {
  return rol ? ETIQUETAS_ROL[rol] : 'Sin rol';
}

/**
 * Indica si el usuario tiene permisos administrativos.
 *
 * @param usuario - Usuario autenticado.
 * @returns `true` si es administrador o superusuario.
 */
export function esAdministrador(usuario: Usuario | null | undefined): boolean {
  if (!usuario) return false;
  return (
    usuario.esAdministrador ||
    usuario.isSuperuser ||
    usuario.rol === 'administrador'
  );
}

/**
 * Indica si el usuario puede gestionar información clínica (pacientes,
 * cunas, prescripciones y planes).
 *
 * @param usuario - Usuario autenticado.
 * @returns `true` para administradores y médicos.
 */
export function puedeGestionarClinica(
  usuario: Usuario | null | undefined
): boolean {
  return esAdministrador(usuario) || usuario?.rol === 'medico';
}

/**
 * Indica si el usuario puede acceder a la bitácora de auditoría.
 *
 * @param usuario - Usuario autenticado.
 * @returns `true` solo para administradores.
 */
export function puedeVerAuditoria(
  usuario: Usuario | null | undefined
): boolean {
  return esAdministrador(usuario);
}

/**
 * Indica si el usuario puede administrar turnos y asignaciones.
 *
 * @param usuario - Usuario autenticado.
 * @returns `true` solo para administradores.
 */
export function puedeAdministrarTurnos(
  usuario: Usuario | null | undefined
): boolean {
  return esAdministrador(usuario);
}

/**
 * Obtiene el nombre visible del usuario a partir de su perfil o cuenta.
 *
 * @param usuario - Usuario autenticado.
 * @param perfil - Perfil clínico asociado.
 * @returns Nombre completo o usuario de red.
 */
export function nombreVisible(
  usuario: Usuario | null | undefined,
  perfil: Perfil | null | undefined
): string {
  return (
    perfil?.nombreCompleto?.trim() ||
    usuario?.nombreCompleto?.trim() ||
    usuario?.username ||
    'Usuario'
  );
}
