/**
 * @file calculos.ts
 * @description Cálculos auxiliares de presentación: iniciales, porcentajes,
 * conteos y evaluación de rangos de signos vitales.
 */

/**
 * Extrae hasta dos iniciales de un nombre.
 *
 * @param nombre - Nombre completo.
 * @returns Iniciales en mayúsculas o `?` si el nombre está vacío.
 */
export function inicialesDe(nombre: string): string {
  const partes = nombre.split(/\s+/).filter(Boolean);
  if (partes.length === 0) return '?';
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return `${partes[0][0]}${partes[partes.length - 1][0]}`.toUpperCase();
}

/**
 * Describe la edad de un neonato en meses.
 *
 * Los pacientes de la unidad suelen tener menos de un mes de vida; mostrar
 * «0 meses» resulta clínicamente pobre, por lo que se usa «Recién nacido».
 *
 * @param meses - Edad en meses.
 * @returns Texto legible con la edad.
 */
export function formatearEdadMeses(meses: number): string {
  if (!Number.isFinite(meses) || meses <= 0) return 'Recién nacido';
  return `${meses} mes${meses === 1 ? '' : 'es'}`;
}

/**
 * Calcula un porcentaje seguro entre 0 y 100.
 *
 * @param parte - Valor parcial.
 * @param total - Valor total.
 * @returns Porcentaje redondeado o `0` si el total es cero.
 */
export function porcentaje(parte: number, total: number): number {
  if (!total || total <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((parte / total) * 100)));
}

/**
 * Cuenta elementos agrupándolos por una clave.
 *
 * @param elementos - Colección a agrupar.
 * @param clave - Función que extrae la clave de agrupación.
 * @returns Mapa de clave a cantidad.
 */
export function contarPor<T, K extends string | number>(
  elementos: T[],
  clave: (elemento: T) => K
): Record<K, number> {
  return elementos.reduce(
    (acumulado, elemento) => {
      const valor = clave(elemento);
      acumulado[valor] = (acumulado[valor] ?? 0) + 1;
      return acumulado;
    },
    {} as Record<K, number>
  );
}

/**
 * Trunca un texto a una longitud máxima agregando puntos suspensivos.
 *
 * @param texto - Texto original.
 * @param maximo - Longitud máxima.
 * @returns Texto truncado.
 */
export function truncar(texto: string, maximo = 80): string {
  if (texto.length <= maximo) return texto;
  return `${texto.slice(0, maximo - 1).trimEnd()}…`;
}

/** Rangos clínicos de referencia usados para colorear signos vitales. */
export const RANGOS_VITALES = {
  ritmoCardiaco: { min: 100, max: 180 },
  spo2: { min: 92, max: 100 },
  temperatura: { min: 36.2, max: 37.5 },
} as const;

/**
 * Evalúa si un signo vital está dentro del rango de referencia.
 *
 * @param tipo - Signo vital a evaluar.
 * @param valor - Lectura actual.
 * @returns `true` si está en rango; `true` también si no hay lectura.
 */
export function signoEnRango(
  tipo: keyof typeof RANGOS_VITALES,
  valor: number | null | undefined
): boolean {
  if (valor === null || valor === undefined) return true;
  const rango = RANGOS_VITALES[tipo];
  return valor >= rango.min && valor <= rango.max;
}
