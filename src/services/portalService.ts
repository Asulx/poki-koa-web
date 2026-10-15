import { apiFetch } from '@/services/api'
import type { HijoPortal } from '@/types/portal'

export const getMisHijos = () => apiFetch<HijoPortal[]>('/portal/mis-hijos/')