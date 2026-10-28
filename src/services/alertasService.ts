/**
 * @file alertasService.ts
 * @description Módulo de servicio crítico para la evaluación y clasificación de signos vitales neonatales.
 * Analiza parámetros como SpO2, frecuencia cardíaca y temperatura para determinar niveles de alerta
 * (Normal, Advertencia o Crítico) de acuerdo con los rangos clínicos seguros.
 */

export interface SignosVitales {
  spo2: number;
  ritmoCardiaco: number;
  temperatura: number;
}

export interface ResultadoAlerta {
  esAlerta: boolean;
  nivel: 'NORMAL' | 'ADVERTENCIA' | 'CRITICO';
  mensaje?: string;
  error?: string;
}

/**
 * Evalúa los signos vitales recibidos (parciales o completos) y determina el estado de alerta del paciente.
 * Valida la existencia obligatoria de los parámetros y aplica reglas de umbrales clínicos.
 * 
 * @param signos - Objeto parcial que contiene los signos vitales actuales a evaluar.
 * @returns Un objeto de tipo {@link ResultadoAlerta} con el diagnóstico, nivel de criticidad y mensajes o errores asociados.
 */
export function evaluarAlerta(signos: Partial<SignosVitales>): ResultadoAlerta {
  if (
    signos.spo2 == null ||
    signos.ritmoCardiaco == null ||
    signos.temperatura == null
  ) {
    return {
      esAlerta: false,
      nivel: 'CRITICO',
      error: 'Faltan parámetros requeridos',
    };
  }

  if (
    signos.spo2 < 88 ||
    signos.ritmoCardiaco > 160 ||
    signos.temperatura > 38.5
  ) {
    return {
      esAlerta: true,
      nivel: 'CRITICO',
      mensaje: 'Valores fuera de rango seguro',
    };
  }

  if (signos.spo2 < 92 || signos.ritmoCardiaco > 140) {
    return {
      esAlerta: true,
      nivel: 'ADVERTENCIA',
      mensaje: 'Precaución en parámetros',
    };
  }

  return { esAlerta: false, nivel: 'NORMAL', mensaje: 'Parámetros normales' };
}