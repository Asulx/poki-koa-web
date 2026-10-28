import axios from 'axios';

/**
 * Instancia centralizada de Axios para la comunicación con el backend de Poki Koa.
 * Configura automáticamente la URL base, un tiempo de espera de 10 segundos,
 * inyecta el token de autenticación desde el localStorage si está disponible,
 * y maneja de forma global los errores de respuesta HTTP (401, 403, 500).
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.error('No autorizado');
          break;

        case 403:
          console.error('Acceso prohibido');
          break;

        case 500:
          console.error('Error servidor');
          break;
      }
    }

    return Promise.reject(error);
  }
);
