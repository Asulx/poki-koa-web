/**
 * @file date.utils.ts
 * @description Utilidades para el manejo, formato y cálculo de fechas en la aplicación.
 */

/**
 * Devuelve la fecha local de hoy como "YYYY-MM-DD".
 * Usa el locale 'en-CA' porque entrega ese formato de forma nativa, sin librerías externas.
 * 
 * @returns Cadena de texto con la fecha actual en formato ISO (YYYY-MM-DD)
 */
export function hoyISO(): string {
  return new Date().toLocaleDateString('en-CA');
}