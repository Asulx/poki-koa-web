import { apiFetch } from "@/services/api";
import type { Usuario } from "@/types/auth";

type LoginRespuesta = Usuario & { token: string };

export function login(username: string, password: string) {
  return apiFetch<LoginRespuesta>("/auth/login/", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}
