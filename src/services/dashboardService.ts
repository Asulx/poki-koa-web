import { apiFetch } from '@/services/api'
import type { ResumenSupervisor } from '@/types/dashboard'

export const getResumenSupervisor = () =>
  apiFetch<ResumenSupervisor>('/dashboard/supervisor-summary/')