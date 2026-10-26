export type Rol = "admin" | "jefe" | "medico" | "enfermero" | "apoderado";

export type Usuario = {
  username: string;
  nombre: string;
  rol: Rol;
};
