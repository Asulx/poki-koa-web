/**
 * @file pacientesService.ts
 * @description Servicio encargado de la gestión integral de pacientes (bebés) en la unidad neonatal.
 * Proporciona métodos asíncronos para listar, obtener por ID, crear y actualizar registros clínicos,
 * realizando los mapeos de datos necesarios entre los modelos del backend y los tipos del cliente.
 */

import { api } from '@/api/axios';
import type { Paciente } from '@/types/paciente';
import type { PacienteFormData } from '@/forms/schemas/pacienteSchema';

const PACIENTES_ENDPOINT = '/bebes/';

/** Estructura de datos cruda del paciente proveniente de la API (Backend). */
interface BebeApi {
  id: number;
  nombre: string;
  nombre_completo?: string;
  fecha_nacimiento: string;
  sexo: string;
  edad_gestacional: string;
  peso: number;
  numero_cuna: string | null;
  fecha_ingreso: string;
  medico_responsable: string | null;
  diagnostico: string;
  estado_canula: string | null;
  via_intravenosa: string | null;
  observaciones?: string;
}

/** Estructura del payload requerida por el backend para la creación y actualización de pacientes. */
interface BebePayload {
  nombre_completo: string;
  edad_gestacional: string;
  sexo: string;
  peso: number;
  fecha_nacimiento: string;
  fecha_ingreso: string;
  diagnostico: string;
  observaciones: string;
}

/**
 * Mapea un objeto de tipo {@link BebeApi} proveniente del servidor a la interfaz interna {@link Paciente}.
 * 
 * @param bebe - Objeto de datos del bebé en formato de API.
 * @returns El objeto transformado a la entidad {@link Paciente}.
 */
function bebeApiAPaciente(bebe: BebeApi): Paciente {
  return {
    id: bebe.id,
    nombre: bebe.nombre ?? bebe.nombre_completo ?? '',
    fechaNacimiento: bebe.fecha_nacimiento,
    sexo: bebe.sexo,
    edadGestacional: bebe.edad_gestacional,
    peso: bebe.peso,
    numeroCuna: bebe.numero_cuna ?? '',
    fechaIngreso: bebe.fecha_ingreso,
    medicoResponsable: bebe.medico_responsable ?? '',
    diagnostico: bebe.diagnostico,
    estadoCanula: bebe.estado_canula ?? '',
    viaIntravenosa: bebe.via_intravenosa ?? '',
    observaciones: bebe.observaciones ?? '',
  };
}

/**
 * Mapea los datos del formulario de paciente {@link PacienteFormData} al formato de carga útil {@link BebePayload} aceptado por la API.
 * 
 * @param paciente - Objeto con los datos del formulario de paciente.
 * @returns El payload adaptado para las peticiones HTTP de escritura.
 */
function pacienteAPayload(paciente: PacienteFormData): BebePayload {
  return {
    nombre_completo: paciente.nombre,
    edad_gestacional: paciente.edadGestacional,
    sexo: paciente.sexo,
    peso: paciente.peso,
    fecha_nacimiento: paciente.fechaNacimiento,
    fecha_ingreso: paciente.fechaIngreso,
    diagnostico: paciente.diagnostico,
    observaciones: paciente.observaciones ?? '',
  };
}

/** Objeto de servicio que agrupa las operaciones de la API para la gestión de pacientes. */
export const pacientesService = {
  /**
   * Obtiene la lista completa de pacientes registrados en la unidad.
   * 
   * @returns Una promesa que resuelve con un arreglo de objetos {@link Paciente}.
   */
  async listar(): Promise<Paciente[]> {
    const response = await api.get<BebeApi[]>(PACIENTES_ENDPOINT);

    return response.data.map(bebeApiAPaciente);
  },

  /**
   * Obtiene los datos detallados de un paciente específico a partir de su ID.
   * 
   * @param id - Identificador numérico único del paciente.
   * @returns Una promesa que resuelve con el objeto {@link Paciente} correspondiente.
   */
  async obtenerPorId(id: number): Promise<Paciente> {
    const response = await api.get<BebeApi>(`${PACIENTES_ENDPOINT}${id}/`);

    return bebeApiAPaciente(response.data);
  },

  /**
   * Registra un nuevo paciente en el sistema a partir de los datos del formulario.
   * 
   * @param paciente - Datos del formulario de creación de paciente.
   * @returns Una promesa que resuelve con el objeto {@link Paciente} recién creado.
   */
  async crear(paciente: PacienteFormData): Promise<Paciente> {
    const response = await api.post<BebeApi>(
      PACIENTES_ENDPOINT,
      pacienteAPayload(paciente)
    );

    return bebeApiAPaciente(response.data);
  },

  /**
   * Actualiza los datos de un paciente existente.
   * 
   * @param id - Identificador numérico único del paciente a actualizar.
   * @param paciente - Datos actualizados provenientes del formulario.
   * @returns Una promesa que resuelve con el objeto {@link Paciente} actualizado.
   */
  async actualizar(id: number, paciente: PacienteFormData): Promise<Paciente> {
    const response = await api.patch<BebeApi>(
      `${PACIENTES_ENDPOINT}${id}/`,
      pacienteAPayload(paciente)
    );

    return bebeApiAPaciente(response.data);
  },
};