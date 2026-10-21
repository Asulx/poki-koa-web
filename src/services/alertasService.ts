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

export function evaluarAlerta(signos: Partial<SignosVitales>): ResultadoAlerta {
  if (signos.spo2 == null || signos.ritmoCardiaco == null || signos.temperatura == null) {
    return { esAlerta: false, nivel: 'CRITICO', error: 'Faltan parámetros requeridos' };
  }

  if (signos.spo2 < 88 || signos.ritmoCardiaco > 160 || signos.temperatura > 38.5) {
    return { esAlerta: true, nivel: 'CRITICO', mensaje: 'Valores fuera de rango seguro' };
  }

  if (signos.spo2 < 92 || signos.ritmoCardiaco > 140) {
    return { esAlerta: true, nivel: 'ADVERTENCIA', mensaje: 'Precaución en parámetros' };
  }

  return { esAlerta: false, nivel: 'NORMAL', mensaje: 'Parámetros normales' };
}