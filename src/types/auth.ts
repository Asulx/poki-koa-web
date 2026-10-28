/**
 * @file usuario.ts
 * @description Definición de contratos de tipo para la gestión de usuarios,
 * roles y control de acceso dentro del sistema neonatal.
 */

/**
 * Roles permitidos en el sistema para el control de permisos y autorizaciones.
 */
export type Rol = 'admin' | 'jefe' | 'medico' | 'enfermero' | 'apoderado';

/**
 * Representa la estructura de datos de un usuario autenticado en el sistema.
 */
export type Usuario = {
  username: string;
  nombre: string;
  rol: Rol;
};
