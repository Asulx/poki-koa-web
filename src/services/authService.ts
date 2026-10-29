/**
 * @file authService.ts
 * @description Ciclo de vida de la sesión contra `/api/auth/`.
 */

import { api } from '@/api/axios';
import { mapSesion, mapSesionRehidratada, type ApiSesion } from '@/api/mappers';
import type { Credenciales, Sesion, SesionRehidratada } from '@/types/auth';

/**
 * Inicia sesión con credenciales clínicas.
 *
 * @param credenciales - Usuario y contraseña.
 * @returns Sesión con token, usuario y perfil.
 */
export async function iniciarSesion(
  credenciales: Credenciales
): Promise<Sesion> {
  const { data } = await api.post<ApiSesion>('/auth/login/', {
    username: credenciales.username.trim(),
    password: credenciales.password,
  });
  return mapSesion(data);
}

/**
 * Invalida el token del usuario en el servidor.
 *
 * Es idempotente desde el punto de vista del cliente: si el token ya no
 * existe, el backend responde 204 igualmente.
 */
export async function cerrarSesion(): Promise<void> {
  await api.post('/auth/logout/');
}

/**
 * Recupera la sesión actual a partir del token guardado.
 *
 * @returns Usuario y perfil, sin token.
 */
export async function obtenerSesion(): Promise<SesionRehidratada> {
  const { data } = await api.get<ApiSesion>('/auth/me/');
  return mapSesionRehidratada(data);
}
