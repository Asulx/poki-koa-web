/**
 * @file apoderado.ts
 * @description Definición de contratos de tipo para la vista del apoderado en el portal,
 * incluyendo datos del paciente, permisos de visualización y registros clínicos autorizados.
 */

export type HijoPortal = {
  paciente_id: number;
  nombre: string;
  parentesco: string;
  sexo: string;
  fecha_nacimiento: string | null;
  fecha_ingreso: string;
  peso: number | null;
  cuna: string | null;
  diagnostico: string | null;
  signos_vitales: {
    ritmo_cardiaco: number | null;
    spo2: number | null;
    temperatura: number | null;
  } | null;
  medicamentos:
    | {
        nombre: string;
        dosis: string;
        via: string;
        hora: string;
        estado: string;
      }[]
    | null;
  permisos: {
    diagnostico: boolean;
    signos_vitales: boolean;
    medicacion: boolean;
  };
};