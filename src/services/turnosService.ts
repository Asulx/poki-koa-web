import { apiFetch } from "@/services/api";
import type {
  Asignacion,
  CunaAsignada,
  CunaResumen,
  NuevaAsignacion,
  Personal,
  Turno,
} from "@/types/turnos";

export const getTurnos = () => apiFetch<Turno[]>("/turnos/");
export const getPersonal = () => apiFetch<Personal[]>("/personal/");
export const getCunas = () => apiFetch<CunaResumen[]>("/cunas/");

export const getAsignaciones = (fecha: string) =>
  apiFetch<Asignacion[]>(`/asignaciones/?fecha=${fecha}`);

export const crearAsignacion = (datos: NuevaAsignacion) =>
  apiFetch<Asignacion>("/asignaciones/", {
    method: "POST",
    body: JSON.stringify(datos),
  });

export const eliminarAsignacion = (id: number) =>
  apiFetch<void>(`/asignaciones/${id}/`, { method: "DELETE" });

export const getMisCunas = (fecha: string) =>
  apiFetch<CunaAsignada[]>(`/asignaciones/mis-cunas/?fecha=${fecha}`);
