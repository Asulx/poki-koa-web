import axios from 'axios'

const getBaseURL = (): string => {
  const envUrl = import.meta.env.VITE_API_URL
  if (envUrl) {
    const cleaned = envUrl.trim().replace(/\/+$/, '')
    return cleaned.endsWith('/api') ? cleaned : `${cleaned}/api`
  }
  return 'http://localhost:8000/api'
}

export const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.error('No autorizado (401)')
          break
        case 403:
          console.error('Acceso prohibido (403)')
          break
        case 404:
          console.error('Recurso no encontrado (404)')
          break
        case 500:
          console.error('Error interno del servidor (500)')
          break
      }
    }
    return Promise.reject(error)
  }
)
