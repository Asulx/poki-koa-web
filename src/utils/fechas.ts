// Devuelve la fecha local de hoy como "YYYY-MM-DD".
// Usamos el locale 'en-CA' porque ya entrega ese formato, sin librerías.
export function hoyISO(): string {
  return new Date().toLocaleDateString("en-CA");
}
