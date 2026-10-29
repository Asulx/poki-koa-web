/**
 * @file mappers.ts
 * @description Traducción entre el contrato `snake_case` de Django REST
 * Framework y los modelos `camelCase` del frontend. Ningún componente debe
 * leer directamente las respuestas crudas de la API: todo pasa por aquí.
 */

import type { Alerta, NivelAlerta, TipoAlerta } from '@/types/alerta';
import type {
  Perfil,
  Rol,
  Sesion,
  SesionRehidratada,
  Usuario,
} from '@/types/auth';
import type { Cuna, EstadoCuna } from '@/types/cuna';
import type {
  EstadoPrescripcion,
  Medicamento,
  MedicamentoCatalogo,
  ViaAdministracion,
} from '@/types/medicamento';
import type { Medico } from '@/types/medico';
import type {
  Paciente,
  PacientePayload,
  SignosVitales,
} from '@/types/paciente';
import type { EstadoPlan, PlanCuidado } from '@/types/plan';
import type {
  DistribucionAlertasItem,
  DistribucionCunasItem,
  DistribucionMedicamentosItem,
  DistribucionReporte,
  PersonalTurnoItem,
  PuntoSerie,
  ResumenOperacion,
  SerieActividad,
} from '@/types/reporte';
import type {
  AccionAuditoria,
  RegistroActividad,
  ResumenAuditoria,
} from '@/types/registro';
import type {
  Asignacion,
  AsignacionPayload,
  MisCunas,
  RespuestaMisCunas,
  Turno,
} from '@/types/turnos';

/* ================================================================
   Utilidades internas
   ================================================================ */

/** Convierte un valor desconocido en texto seguro. */
function texto(valor: unknown, porDefecto = ''): string {
  if (valor === null || valor === undefined) return porDefecto;
  return String(valor);
}

/** Convierte un valor desconocido en número o `null`. */
function numeroOpcional(valor: unknown): number | null {
  if (valor === null || valor === undefined || valor === '') return null;
  const numero = Number(valor);
  return Number.isFinite(numero) ? numero : null;
}

/** Convierte un valor desconocido en número con valor por defecto. */
function numero(valor: unknown, porDefecto = 0): number {
  return numeroOpcional(valor) ?? porDefecto;
}

/** Normaliza una hora ISO (`08:00:00`) al formato de `input[type=time]`. */
export function horaCorta(valor: unknown): string {
  const cadena = texto(valor);
  const coincidencia = cadena.match(/^(\d{2}):(\d{2})/);
  return coincidencia ? `${coincidencia[1]}:${coincidencia[2]}` : cadena;
}

/* ================================================================
   Autenticación
   ================================================================ */

/** Forma cruda del usuario devuelto por la API. */
export interface ApiUsuario {
  id?: number;
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  nombre_completo?: string;
  iniciales?: string;
  rol?: string | null;
  rol_display?: string | null;
  turno?: string | null;
  es_administrador?: boolean;
  is_superuser?: boolean;
  is_staff?: boolean;
  is_active?: boolean;
}

/** Forma cruda del perfil devuelto por la API. */
export interface ApiPerfil {
  id?: number;
  usuario?: number;
  rol?: string | null;
  rol_display?: string | null;
  turno?: string | null;
  nombre_completo?: string;
  iniciales?: string;
  creado_en?: string;
  actualizado_en?: string;
}

/** Forma cruda de la respuesta de login/me. */
export interface ApiSesion {
  token?: string;
  usuario: ApiUsuario;
  perfil?: ApiPerfil | null;
}

/** Mapea un rol de la API al catálogo del frontend. */
function mapRol(valor: unknown): Rol | null {
  if (
    valor === 'administrador' ||
    valor === 'medico' ||
    valor === 'enfermeria'
  ) {
    return valor;
  }
  return null;
}

/**
 * Convierte el usuario de la API al modelo del frontend.
 *
 * @param datos - Usuario en `snake_case`.
 * @returns Usuario normalizado.
 */
export function mapUsuario(datos: ApiUsuario): Usuario {
  const nombreCompleto =
    texto(datos.nombre_completo) ||
    `${texto(datos.first_name)} ${texto(datos.last_name)}`.trim() ||
    texto(datos.username, 'Usuario');

  return {
    id: numero(datos.id),
    username: texto(datos.username),
    email: texto(datos.email),
    firstName: texto(datos.first_name),
    lastName: texto(datos.last_name),
    nombreCompleto,
    iniciales: texto(datos.iniciales) || inicialesDe(nombreCompleto),
    rol: mapRol(datos.rol),
    rolDisplay: datos.rol_display ? texto(datos.rol_display) : null,
    turno: datos.turno ? texto(datos.turno) : null,
    esAdministrador: Boolean(datos.es_administrador),
    isSuperuser: Boolean(datos.is_superuser),
    isStaff: Boolean(datos.is_staff),
    activo: datos.is_active !== false,
  };
}

/**
 * Convierte el perfil de la API al modelo del frontend.
 *
 * @param datos - Perfil en `snake_case` o `null`.
 * @returns Perfil normalizado o `null`.
 */
export function mapPerfil(datos: ApiPerfil | null | undefined): Perfil | null {
  if (!datos) return null;
  return {
    id: numero(datos.id),
    usuarioId: numero(datos.usuario),
    rol: mapRol(datos.rol),
    rolDisplay: datos.rol_display ? texto(datos.rol_display) : null,
    turno: datos.turno ? texto(datos.turno) : null,
    nombreCompleto: texto(datos.nombre_completo),
    iniciales: texto(datos.iniciales),
    creadoEn: texto(datos.creado_en),
    actualizadoEn: texto(datos.actualizado_en),
  };
}

/**
 * Construye una sesión completa a partir de la respuesta de login.
 *
 * @param datos - Respuesta cruda con token, usuario y perfil.
 * @returns Sesión lista para el contexto de autenticación.
 */
export function mapSesion(datos: ApiSesion): Sesion {
  return {
    token: texto(datos.token),
    usuario: mapUsuario(datos.usuario),
    perfil: mapPerfil(datos.perfil),
  };
}

/**
 * Construye una sesión rehidratada (sin token) desde `/auth/me/`.
 *
 * @param datos - Respuesta cruda con usuario y perfil.
 * @returns Sesión sin token.
 */
export function mapSesionRehidratada(datos: ApiSesion): SesionRehidratada {
  return {
    usuario: mapUsuario(datos.usuario),
    perfil: mapPerfil(datos.perfil),
  };
}

/** Calcula iniciales a partir de un nombre completo. */
function inicialesDe(nombre: string): string {
  const partes = nombre.split(' ').filter(Boolean);
  if (partes.length === 0) return '?';
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return `${partes[0][0]}${partes[partes.length - 1][0]}`.toUpperCase();
}

/* ================================================================
   Entidades clínicas
   ================================================================ */

/** Forma cruda de una alerta. */
export interface ApiAlerta {
  id?: number;
  paciente?: number | null;
  paciente_nombre?: string | null;
  cuna?: number | null;
  cuna_identificador?: string | null;
  tipo?: string;
  tipo_display?: string;
  nivel?: string;
  nivel_display?: string;
  mensaje?: string;
  fecha_hora?: string;
  activa?: boolean;
  valor_leido?: number | null;
}

/** Forma cruda de una prescripción. */
export interface ApiMedicamento {
  id?: number;
  paciente?: number;
  paciente_nombre?: string;
  cuna?: string;
  nombre?: string;
  dosis?: string;
  via?: string;
  hora?: string;
  estado?: string;
}

/** Forma cruda de un paciente. */
export interface ApiBebe {
  id?: number;
  identificador?: string;
  nombre_completo?: string;
  edad_meses?: number;
  edad_gestacional?: string | number | null;
  sexo?: string;
  peso?: number | null;
  fecha_nacimiento?: string | null;
  fecha_ingreso?: string;
  diagnostico?: string | null;
  observaciones?: string | null;
  plan_cuidados?: string | null;
  activo?: boolean;
  fecha_alta?: string | null;
  motivo_alta?: string | null;
  medico_a_cargo?: number | null;
  medico_nombre?: string | null;
  medico_responsable?: string | null;
  cuna_id?: number | null;
  cuna_identificador?: string | null;
  estado_canula?: boolean | null;
  via_intravenosa?: boolean | null;
  signos_vitales?: {
    ritmo_cardiaco?: number | null;
    spo2?: number | null;
    temperatura?: number | null;
  } | null;
  medicamentos?: ApiMedicamento[];
  alertas?: ApiAlerta[];
}

/** Forma cruda de una cuna. */
export interface ApiCuna {
  id?: number;
  identificador?: string;
  estado?: string;
  paciente?: number | null;
  paciente_detalle?: ApiBebe | null;
  paciente_nombre?: string | null;
  paciente_identificador?: string | null;
  tiene_alerta_critica?: boolean;
  ritmo_cardiaco?: number | null;
  spo2?: number | null;
  temperatura?: number | null;
  estado_sueno?: string;
  canula_ok?: boolean;
  via_iv_activa?: boolean;
  en_mantenimiento?: boolean;
  ultima_actualizacion?: string;
}

/** Forma cruda de un plan de cuidado. */
export interface ApiPlan {
  id?: number;
  bebe?: number;
  paciente_nombre?: string;
  cuna?: string;
  area_cuidado?: string;
  intervencion?: string;
  frecuencia?: string;
  estado?: string;
}

/**
 * Mapea una alerta clínica.
 *
 * @param datos - Alerta en `snake_case`.
 * @returns Alerta normalizada.
 */
export function mapAlerta(datos: ApiAlerta): Alerta {
  return {
    id: numero(datos.id),
    pacienteId: numeroOpcional(datos.paciente),
    pacienteNombre: datos.paciente_nombre ? texto(datos.paciente_nombre) : null,
    cunaId: numeroOpcional(datos.cuna),
    cunaIdentificador: datos.cuna_identificador
      ? texto(datos.cuna_identificador)
      : null,
    tipo: (texto(datos.tipo, 'otra') as TipoAlerta) || 'otra',
    tipoDisplay: texto(datos.tipo_display, 'Otra alerta'),
    nivel: (texto(datos.nivel, 'Info') as NivelAlerta) || 'Info',
    nivelDisplay: texto(datos.nivel_display, 'Información'),
    mensaje: texto(datos.mensaje),
    fechaHora: texto(datos.fecha_hora),
    activa: datos.activa !== false,
    valorLeido: numeroOpcional(datos.valor_leido),
  };
}

/**
 * Mapea una prescripción de medicamento.
 *
 * @param datos - Prescripción en `snake_case`.
 * @returns Prescripción normalizada.
 */
export function mapMedicamento(datos: ApiMedicamento): Medicamento {
  return {
    id: numero(datos.id),
    pacienteId: numero(datos.paciente),
    pacienteNombre: texto(datos.paciente_nombre),
    cuna: texto(datos.cuna, 'Sin cuna'),
    nombre: texto(datos.nombre),
    dosis: texto(datos.dosis),
    via: (texto(datos.via, 'VO') as ViaAdministracion) || 'VO',
    hora: horaCorta(datos.hora),
    estado:
      (texto(datos.estado, 'Pendiente') as EstadoPrescripcion) || 'Pendiente',
  };
}

/**
 * Mapea un paciente y sus relaciones anidadas.
 *
 * @param datos - Paciente en `snake_case`.
 * @returns Paciente normalizado.
 */
export function mapPaciente(datos: ApiBebe): Paciente {
  const signos: SignosVitales | null = datos.signos_vitales
    ? {
        ritmoCardiaco: numeroOpcional(datos.signos_vitales.ritmo_cardiaco),
        spo2: numeroOpcional(datos.signos_vitales.spo2),
        temperatura: numeroOpcional(datos.signos_vitales.temperatura),
      }
    : null;

  return {
    id: numero(datos.id),
    identificador: texto(datos.identificador),
    nombreCompleto: texto(datos.nombre_completo),
    edadMeses: numero(datos.edad_meses),
    edadGestacional: numeroOpcional(datos.edad_gestacional),
    sexo: datos.sexo === 'M' ? 'M' : 'F',
    peso: numeroOpcional(datos.peso),
    fechaNacimiento: datos.fecha_nacimiento
      ? texto(datos.fecha_nacimiento)
      : null,
    fechaIngreso: texto(datos.fecha_ingreso),
    diagnostico: texto(datos.diagnostico),
    observaciones: texto(datos.observaciones),
    planCuidados: texto(datos.plan_cuidados),
    activo: datos.activo !== false,
    fechaAlta: datos.fecha_alta ? texto(datos.fecha_alta) : null,
    motivoAlta: texto(datos.motivo_alta),
    medicoId: numeroOpcional(datos.medico_a_cargo),
    medicoNombre:
      datos.medico_nombre || datos.medico_responsable
        ? texto(datos.medico_nombre ?? datos.medico_responsable)
        : null,
    cunaId: numeroOpcional(datos.cuna_id),
    cunaIdentificador: datos.cuna_identificador
      ? texto(datos.cuna_identificador)
      : null,
    estadoCanula:
      typeof datos.estado_canula === 'boolean' ? datos.estado_canula : null,
    viaIntravenosa:
      typeof datos.via_intravenosa === 'boolean' ? datos.via_intravenosa : null,
    signosVitales: signos,
    medicamentos: (datos.medicamentos ?? []).map(mapMedicamento),
    alertas: (datos.alertas ?? []).map(mapAlerta),
  };
}

/**
 * Traduce el formulario del frontend al contrato de la API.
 *
 * @param datos - Datos del formulario en `camelCase`.
 * @returns Cuerpo JSON en `snake_case`.
 */
export function mapPacientePayload(
  datos: PacientePayload
): Record<string, unknown> {
  return {
    identificador: datos.identificador,
    nombre_completo: datos.nombreCompleto,
    edad_meses: datos.edadMeses,
    edad_gestacional: datos.edadGestacional ?? null,
    sexo: datos.sexo,
    peso: datos.peso ?? null,
    fecha_nacimiento: datos.fechaNacimiento || null,
    diagnostico: datos.diagnostico ?? '',
    observaciones: datos.observaciones ?? '',
    plan_cuidados: datos.planCuidados ?? '',
    medico_a_cargo: datos.medicoACargo ?? null,
  };
}

/**
 * Mapea una cuna y su paciente embebido.
 *
 * @param datos - Cuna en `snake_case`.
 * @returns Cuna normalizada.
 */
export function mapCuna(datos: ApiCuna): Cuna {
  const estadoApi = texto(datos.estado);
  const estado: EstadoCuna =
    estadoApi === 'ocupada' || estadoApi === 'mantenimiento'
      ? estadoApi
      : 'disponible';

  return {
    id: numero(datos.id),
    identificador: texto(datos.identificador),
    estado,
    pacienteId: numeroOpcional(datos.paciente),
    pacienteNombre: datos.paciente_nombre ? texto(datos.paciente_nombre) : null,
    pacienteIdentificador: datos.paciente_identificador
      ? texto(datos.paciente_identificador)
      : null,
    pacienteDetalle: datos.paciente_detalle
      ? mapPaciente(datos.paciente_detalle)
      : null,
    tieneAlertaCritica: Boolean(datos.tiene_alerta_critica),
    ritmoCardiaco: numeroOpcional(datos.ritmo_cardiaco),
    spo2: numeroOpcional(datos.spo2),
    temperatura: numeroOpcional(datos.temperatura),
    estadoSueno: texto(datos.estado_sueno, 'Despierto'),
    canulaOk: datos.canula_ok !== false,
    viaIvActiva: Boolean(datos.via_iv_activa),
    enMantenimiento: Boolean(datos.en_mantenimiento),
    ultimaActualizacion: texto(datos.ultima_actualizacion),
  };
}

/**
 * Mapea un plan de cuidado.
 *
 * @param datos - Plan en `snake_case`.
 * @returns Plan normalizado.
 */
export function mapPlan(datos: ApiPlan): PlanCuidado {
  return {
    id: numero(datos.id),
    pacienteId: numero(datos.bebe),
    pacienteNombre: texto(datos.paciente_nombre),
    cuna: texto(datos.cuna, 'Sin cuna'),
    areaCuidado: texto(datos.area_cuidado),
    intervencion: texto(datos.intervencion),
    frecuencia: texto(datos.frecuencia),
    estado: (texto(datos.estado, 'Activo') as EstadoPlan) || 'Activo',
  };
}

/**
 * Mapea un médico.
 *
 * @param datos - Médico en `snake_case`.
 * @returns Médico normalizado.
 */
export function mapMedico(datos: {
  id?: number;
  nombre_completo?: string;
  turno?: string | null;
}): Medico {
  return {
    id: numero(datos.id),
    nombreCompleto: texto(datos.nombre_completo),
    turno: datos.turno ? texto(datos.turno) : null,
  };
}

/**
 * Mapea un producto del catálogo de medicamentos.
 *
 * @param datos - Producto en `snake_case`.
 * @returns Producto normalizado.
 */
export function mapCatalogo(datos: {
  id?: number;
  nombre?: string;
  principio_activo?: string;
  dosis_mg?: string | number;
  stock?: number;
}): MedicamentoCatalogo {
  return {
    id: numero(datos.id),
    nombre: texto(datos.nombre),
    principioActivo: texto(datos.principio_activo),
    dosisMg: numero(datos.dosis_mg),
    stock: numero(datos.stock),
  };
}

/* ================================================================
   Operación
   ================================================================ */

/** Forma cruda de un turno. */
export interface ApiTurno {
  id?: number;
  nombre?: string;
  hora_inicio?: string;
  hora_fin?: string;
  activo?: boolean;
  duracion_horas?: number;
}

/** Forma cruda de una asignación. */
export interface ApiAsignacion {
  id?: number;
  usuario?: number;
  usuario_nombre?: string;
  usuario_iniciales?: string;
  usuario_rol?: string | null;
  turno?: number;
  turno_nombre?: string;
  turno_hora_inicio?: string;
  turno_hora_fin?: string;
  cuna?: number | null;
  cuna_identificador?: string | null;
  fecha?: string;
  creado_por?: number | null;
  creado_en?: string;
}

/** Forma cruda de una cuna asignada al usuario. */
export interface ApiMisCunas {
  cuna_id?: number;
  cuna_identificador?: string;
  turno?: string;
  hora_inicio?: string;
  hora_fin?: string;
  paciente_id?: number | null;
  paciente_nombre?: string | null;
  paciente_identificador?: string | null;
  ritmo_cardiaco?: number | null;
  spo2?: number | null;
  temperatura?: number | null;
  alertas_activas?: number;
}

/** Forma cruda de un registro de auditoría. */
export interface ApiRegistro {
  id?: number;
  usuario?: number | null;
  usuario_nombre?: string;
  accion?: string;
  accion_display?: string;
  entidad?: string;
  entidad_id?: string | number | null;
  descripcion?: string;
  metadata?: Record<string, unknown> | null;
  ip_address?: string | null;
  creado_en?: string;
}

/**
 * Mapea un turno.
 *
 * @param datos - Turno en `snake_case`.
 * @returns Turno normalizado.
 */
export function mapTurno(datos: ApiTurno): Turno {
  return {
    id: numero(datos.id),
    nombre: texto(datos.nombre),
    horaInicio: horaCorta(datos.hora_inicio),
    horaFin: horaCorta(datos.hora_fin),
    activo: datos.activo !== false,
    duracionHoras: numero(datos.duracion_horas),
  };
}

/**
 * Mapea una asignación de turno.
 *
 * @param datos - Asignación en `snake_case`.
 * @returns Asignación normalizada.
 */
export function mapAsignacion(datos: ApiAsignacion): Asignacion {
  return {
    id: numero(datos.id),
    usuarioId: numero(datos.usuario),
    usuarioNombre: texto(datos.usuario_nombre),
    usuarioIniciales: texto(datos.usuario_iniciales),
    usuarioRol: mapRol(datos.usuario_rol),
    turnoId: numero(datos.turno),
    turnoNombre: texto(datos.turno_nombre),
    turnoHoraInicio: horaCorta(datos.turno_hora_inicio),
    turnoHoraFin: horaCorta(datos.turno_hora_fin),
    cunaId: numeroOpcional(datos.cuna),
    cunaIdentificador: datos.cuna_identificador
      ? texto(datos.cuna_identificador)
      : null,
    fecha: texto(datos.fecha),
    creadoPor: numeroOpcional(datos.creado_por),
    creadoEn: texto(datos.creado_en),
  };
}

/**
 * Traduce el formulario de asignación al contrato de la API.
 *
 * @param datos - Asignación en `camelCase`.
 * @returns Cuerpo JSON en `snake_case`.
 */
export function mapAsignacionPayload(
  datos: AsignacionPayload
): Record<string, unknown> {
  return {
    usuario: datos.usuario,
    turno: datos.turno,
    cuna: datos.cuna,
    fecha: datos.fecha,
  };
}

/**
 * Mapea una cuna cubierta por el usuario autenticado.
 *
 * @param datos - Cuna en `snake_case`.
 * @returns Cuna asignada normalizada.
 */
export function mapMisCunas(datos: ApiMisCunas): MisCunas {
  return {
    cunaId: numero(datos.cuna_id),
    cunaIdentificador: texto(datos.cuna_identificador),
    turno: texto(datos.turno),
    horaInicio: horaCorta(datos.hora_inicio),
    horaFin: horaCorta(datos.hora_fin),
    pacienteId: numeroOpcional(datos.paciente_id),
    pacienteNombre: datos.paciente_nombre ? texto(datos.paciente_nombre) : null,
    pacienteIdentificador: datos.paciente_identificador
      ? texto(datos.paciente_identificador)
      : null,
    ritmoCardiaco: numeroOpcional(datos.ritmo_cardiaco),
    spo2: numeroOpcional(datos.spo2),
    temperatura: numeroOpcional(datos.temperatura),
    alertasActivas: numero(datos.alertas_activas),
  };
}

/**
 * Mapea la respuesta completa de `/mis-cunas/`.
 *
 * @param datos - Respuesta cruda.
 * @returns Respuesta normalizada.
 */
export function mapRespuestaMisCunas(datos: {
  fecha?: string;
  total?: number;
  cunas?: ApiMisCunas[];
}): RespuestaMisCunas {
  const cunas = (datos.cunas ?? []).map(mapMisCunas);
  return {
    fecha: texto(datos.fecha),
    total: numero(datos.total, cunas.length),
    cunas,
  };
}

/**
 * Mapea un registro de auditoría.
 *
 * @param datos - Registro en `snake_case`.
 * @returns Registro normalizado.
 */
export function mapRegistro(datos: ApiRegistro): RegistroActividad {
  return {
    id: numero(datos.id),
    usuarioId: numeroOpcional(datos.usuario),
    usuarioNombre: texto(datos.usuario_nombre, 'Sistema'),
    accion:
      (texto(datos.accion, 'actualizar') as AccionAuditoria) || 'actualizar',
    accionDisplay: texto(datos.accion_display, texto(datos.accion)),
    entidad: texto(datos.entidad),
    entidadId:
      datos.entidad_id === null || datos.entidad_id === undefined
        ? null
        : texto(datos.entidad_id),
    descripcion: texto(datos.descripcion),
    metadata: datos.metadata ?? {},
    ipAddress: datos.ip_address ? texto(datos.ip_address) : null,
    creadoEn: texto(datos.creado_en),
  };
}

/**
 * Mapea el conteo de auditoría por acción.
 *
 * @param datos - Elemento crudo `{accion, total}`.
 * @returns Resumen normalizado.
 */
export function mapResumenAuditoria(datos: {
  accion?: string;
  total?: number;
}): ResumenAuditoria {
  return {
    accion:
      (texto(datos.accion, 'actualizar') as AccionAuditoria) || 'actualizar',
    total: numero(datos.total),
  };
}

/* ================================================================
   Reportes
   ================================================================ */

/** Forma cruda del resumen operacional. */
export interface ApiResumen {
  total_pacientes?: number;
  pacientes_activos?: number;
  pacientes_dados_de_alta?: number;
  total_cunas?: number;
  cunas_ocupadas?: number;
  cunas_disponibles?: number;
  cunas_mantenimiento?: number;
  ocupacion_porcentaje?: number;
  total_medicamentos?: number;
  medicamentos_pendientes?: number;
  medicamentos_administrados?: number;
  medicamentos_stock_critico?: number;
  alertas_activas?: number;
  alertas_criticas?: number;
  planes_activos?: number;
  personal_activo?: number;
  turnos_activos?: number;
  asignaciones_hoy?: number;
  generado_en?: string;
}

/**
 * Mapea el resumen operacional del dashboard.
 *
 * @param datos - Resumen en `snake_case`.
 * @returns Resumen normalizado.
 */
export function mapResumen(datos: ApiResumen): ResumenOperacion {
  return {
    totalPacientes: numero(datos.total_pacientes),
    pacientesActivos: numero(datos.pacientes_activos),
    pacientesDadosDeAlta: numero(datos.pacientes_dados_de_alta),
    totalCunas: numero(datos.total_cunas),
    cunasOcupadas: numero(datos.cunas_ocupadas),
    cunasDisponibles: numero(datos.cunas_disponibles),
    cunasMantenimiento: numero(datos.cunas_mantenimiento),
    ocupacionPorcentaje: numero(datos.ocupacion_porcentaje),
    totalMedicamentos: numero(datos.total_medicamentos),
    medicamentosPendientes: numero(datos.medicamentos_pendientes),
    medicamentosAdministrados: numero(datos.medicamentos_administrados),
    medicamentosStockCritico: numero(datos.medicamentos_stock_critico),
    alertasActivas: numero(datos.alertas_activas),
    alertasCriticas: numero(datos.alertas_criticas),
    planesActivos: numero(datos.planes_activos),
    personalActivo: numero(datos.personal_activo),
    turnosActivos: numero(datos.turnos_activos),
    asignacionesHoy: numero(datos.asignaciones_hoy),
    generadoEn: texto(datos.generado_en),
  };
}

/**
 * Mapea la serie diaria de actividad.
 *
 * @param datos - Respuesta cruda `{dias, serie}`.
 * @returns Serie normalizada.
 */
export function mapSerie(datos: {
  dias?: number;
  serie?: Array<{ fecha?: string; ingresos?: number; alertas?: number }>;
}): SerieActividad {
  const serie: PuntoSerie[] = (datos.serie ?? []).map((punto) => ({
    fecha: texto(punto.fecha),
    ingresos: numero(punto.ingresos),
    alertas: numero(punto.alertas),
  }));
  return {
    dias: numero(datos.dias, serie.length),
    serie,
  };
}

/**
 * Mapea las distribuciones agregadas.
 *
 * @param datos - Respuesta cruda.
 * @returns Distribuciones normalizadas.
 */
export function mapDistribucion(datos: {
  cunas?: Array<{ estado?: string; cantidad?: number }>;
  alertas?: Array<{ tipo?: string; etiqueta?: string; cantidad?: number }>;
  medicamentos?: Array<{ estado?: string; cantidad?: number }>;
  personal?: Array<{
    turno?: string;
    cantidad?: number;
    hora_inicio?: string;
    hora_fin?: string;
  }>;
}): DistribucionReporte {
  const cunas: DistribucionCunasItem[] = (datos.cunas ?? []).map((item) => ({
    estado:
      item.estado === 'ocupada' || item.estado === 'mantenimiento'
        ? item.estado
        : 'disponible',
    cantidad: numero(item.cantidad),
  }));

  const alertas: DistribucionAlertasItem[] = (datos.alertas ?? []).map(
    (item) => ({
      tipo: texto(item.tipo),
      etiqueta: texto(item.etiqueta, texto(item.tipo)),
      cantidad: numero(item.cantidad),
    })
  );

  const medicamentos: DistribucionMedicamentosItem[] = (
    datos.medicamentos ?? []
  ).map((item) => ({
    estado: texto(item.estado),
    cantidad: numero(item.cantidad),
  }));

  const personal: PersonalTurnoItem[] = (datos.personal ?? []).map((item) => ({
    turno: texto(item.turno),
    cantidad: numero(item.cantidad),
    horaInicio: horaCorta(item.hora_inicio),
    horaFin: horaCorta(item.hora_fin),
  }));

  return { cunas, alertas, medicamentos, personal };
}
