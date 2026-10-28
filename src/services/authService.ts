/**
 * @file authService.ts
 * @description Servicio de autenticación para la gestión de inicio de sesión y validación de credenciales
 * con el backend de Django REST Framework mediante el cliente HTTP centralizado.
 */

import { apiFetch } from '@/services/api';
import type { Usuario } from '@/types/auth';

/** Tipo que define la estructura de la respuesta exitosa de autenticación, combinando los datos del usuario y el token de sesión. */
type LoginRespuesta = Usuario & { token: string };

/**
 * Autentica a un usuario en el sistema enviando sus credenciales al endpoint de login.
 *
 * @param username - Nombre de usuario o identificador clínico.
 * @param password - Contraseña de acceso del usuario.
 * @returns Una promesa que resuelve con los datos del usuario y el token de autenticación.
 */
export function login(username: string, password: string) {
  return apiFetch<LoginRespuesta>('/auth/login/', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}
