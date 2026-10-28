/**
 * @file api.ts
 * @description Cliente HTTP centralizado basado en `fetch` para la comunicación con el backend de Django REST Framework.
 * Gestiona la inyección automática de tokens de autenticación, el procesamiento de cabeceras y la extracción estandarizada de errores.
 */

// La URL del backend se puede cambiar con VITE_API_URL en un archivo .env
const API_URL = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000/api';

export const TOKEN_KEY = 'pokikoa_token';

/**
 * Extrae y formatea los mensajes de error devueltos por el backend (Django REST Framework).
 * Soporta estructuras de tipo `{"detail": "..."}` o errores de validación por campo `{"campo": ["mensaje"]}`.
 *
 * @param datos - Objeto de datos desconocido proveniente de la respuesta HTTP de error.
 * @returns Una cadena de texto con el mensaje de error unificado.
 */
function extraerMensaje(datos: unknown): string {
  if (datos && typeof datos === 'object') {
    const d = datos as Record<string, unknown>;
    if (typeof d.detail === 'string') return d.detail;
    return Object.values(d).flat().join(' ');
  }
  return 'Error inesperado del servidor';
}

/**
 * Función centralizada para realizar peticiones HTTP a la API.
 * Inyecta automáticamente el token de autorización si está presente y maneja la respuesta y los errores del servidor.
 *
 * @typeParam T - Tipo de dato esperado en la respuesta de la API.
 * @param ruta - Ruta relativa del endpoint a consultar.
 * @param opciones - Opciones de configuración adicionales para la petición `fetch` (método, cuerpo, etc.).
 * @returns Una promesa que resuelve con los datos tipados de la respuesta.
 */
export async function apiFetch<T>(
  ruta: string,
  opciones: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem(TOKEN_KEY);
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) headers.Authorization = `Token ${token}`;

  const respuesta = await fetch(`${API_URL}${ruta}`, { ...opciones, headers });

  if (respuesta.status === 204) return undefined as T; // DELETE sin contenido

  const datos = await respuesta.json().catch(() => null);
  if (!respuesta.ok) throw new Error(extraerMensaje(datos));
  return datos as T;
}
