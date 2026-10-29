/**
 * @file axios.ts
 * @description Cliente HTTP único de la aplicación. Centraliza la URL base,
 * el token de autenticación (`Token` de DRF), el manejo global de errores y
 * la normalización de mensajes para la interfaz.
 */

import axios, { AxiosError } from 'axios';

/** Clave de `localStorage` donde se persiste el token de sesión. */
export const TOKEN_KEY = 'pokikoa_token';

/** Evento global emitido cuando la API rechaza el token (HTTP 401). */
export const EVENTO_SESION_EXPIRADA = 'pokikoa:sesion-expirada';

/**
 * URL base de la API.
 *
 * Se toma de `VITE_API_URL` (debe incluir el sufijo `/api`) y, si no está
 * definida, se usa el backend local de desarrollo.
 */
export const API_URL =
  import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

/** Instancia central de Axios compartida por todos los servicios. */
export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (respuesta) => respuesta,
  (error: AxiosError) => {
    const esLogin = error.config?.url?.includes('/auth/login/');
    if (error.response?.status === 401 && !esLogin) {
      // La sesión ya no es válida: se notifica al AuthContext para que
      // limpie el estado y redirija al login sin acoplar el cliente HTTP
      // a React.
      window.dispatchEvent(new Event(EVENTO_SESION_EXPIRADA));
    }
    return Promise.reject(error);
  }
);

/**
 * Extrae un mensaje legible de un error de DRF.
 *
 * Soporta `{"detail": "..."}`, errores por campo (`{"campo": ["..."]}`),
 * `non_field_errors`, respuestas anidadas y errores de red/timeout.
 *
 * @param error - Error desconocido capturado en un `catch`.
 * @returns Mensaje en español listo para mostrarse en la interfaz.
 */
export function obtenerMensajeError(error: unknown): string {
  if (!axios.isAxiosError(error)) {
    if (error instanceof Error && error.message) return error.message;
    return 'Ocurrió un error inesperado. Intenta nuevamente.';
  }

  const axiosError = error as AxiosError<unknown>;

  if (axiosError.code === 'ECONNABORTED') {
    return 'La solicitud tardó demasiado. Verifica la conexión con el servidor.';
  }

  if (!axiosError.response) {
    return 'No se pudo conectar con el servidor. Verifica que el backend esté en ejecución.';
  }

  const datos = axiosError.response.data;
  const mensaje = extraerMensaje(datos);

  if (mensaje) return mensaje;

  return `Error ${axiosError.response.status}: no fue posible completar la operación.`;
}

/**
 * Recorre recursivamente la respuesta de error de DRF hasta encontrar el
 * primer mensaje de texto disponible.
 *
 * @param datos - Cuerpo de la respuesta de error.
 * @returns Mensaje encontrado o cadena vacía.
 */
function extraerMensaje(datos: unknown): string {
  if (typeof datos === 'string') return datos.slice(0, 400);

  if (Array.isArray(datos)) {
    for (const elemento of datos) {
      const mensaje = extraerMensaje(elemento);
      if (mensaje) return mensaje;
    }
    return '';
  }

  if (datos && typeof datos === 'object') {
    const registro = datos as Record<string, unknown>;

    for (const clave of ['detail', 'error', 'non_field_errors', 'mensaje']) {
      const valor = registro[clave];
      if (typeof valor === 'string' && valor.trim()) return valor;
      if (Array.isArray(valor)) {
        const mensaje = extraerMensaje(valor);
        if (mensaje) return mensaje;
      }
    }

    for (const [clave, valor] of Object.entries(registro)) {
      const mensaje = extraerMensaje(valor);
      if (mensaje) {
        return clave === 'detail'
          ? mensaje
          : `${etiquetaCampo(clave)}: ${mensaje}`;
      }
    }
  }

  return '';
}

/**
 * Convierte el nombre técnico de un campo en una etiqueta legible.
 *
 * @param campo - Nombre del campo devuelto por el backend.
 * @returns Etiqueta con espacios y primera letra en mayúscula.
 */
function etiquetaCampo(campo: string): string {
  const texto = campo.replace(/_/g, ' ').trim();
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

/**
 * Descarga un archivo binario o de texto desde la API respetando el token.
 *
 * @param ruta - Ruta relativa al `baseURL` (por ejemplo `/reportes/exportar/`).
 * @param nombreSugerido - Nombre de archivo usado si el servidor no envía uno.
 */
export async function descargarArchivo(
  ruta: string,
  nombreSugerido: string
): Promise<void> {
  const respuesta = await api.get<Blob>(ruta, { responseType: 'blob' });

  const disposicion = respuesta.headers['content-disposition'] as
    string | undefined;
  const coincidencia = disposicion?.match(/filename="?([^";]+)"?/i);
  const nombre = coincidencia?.[1] ?? nombreSugerido;

  const url = URL.createObjectURL(respuesta.data);
  const enlace = document.createElement('a');
  enlace.href = url;
  enlace.download = nombre;
  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();
  URL.revokeObjectURL(url);
}
