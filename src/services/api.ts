// La URL del backend se puede cambiar con VITE_API_URL en un archivo .env
const API_URL = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000/api'

export const TOKEN_KEY = 'pokikoa_token'

// DRF responde errores como {"detail": "..."} o {"campo": ["mensaje"]}; lo dejamos en un texto
function extraerMensaje(datos: unknown): string {
  if (datos && typeof datos === 'object') {
    const d = datos as Record<string, unknown>
    if (typeof d.detail === 'string') return d.detail
    return Object.values(d).flat().join(' ')
  }
  return 'Error inesperado del servidor'
}

// Un único punto para llamar a la API: agrega el token y maneja los errores
export async function apiFetch<T>(
  ruta: string,
  opciones: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem(TOKEN_KEY)
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (token) headers.Authorization = `Token ${token}`

  const respuesta = await fetch(`${API_URL}${ruta}`, { ...opciones, headers })

  if (respuesta.status === 204) return undefined as T // DELETE sin contenido

  const datos = await respuesta.json().catch(() => null)
  if (!respuesta.ok) throw new Error(extraerMensaje(datos))
  return datos as T
}