export type HijoPortal = {
  paciente_id: number;
  nombre: string;
  parentesco: string;
  sexo: string;
  fecha_nacimiento: string | null;
  fecha_ingreso: string;
  peso: number | null;
  cuna: string | null;
  // null = el equipo médico no autorizó esta sección
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
