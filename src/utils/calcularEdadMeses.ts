
export function calcularEdadMeses(fechaNacimiento: string): number {
  const partes = fechaNacimiento.split('-').map(Number)

  if (
    partes.length !== 3 ||
    partes.some((numero) => !Number.isInteger(numero))
  ) {
    throw new Error('Fecha de nacimiento inválida')
  }

  const [anio, mes, dia] = partes
  const nacimiento = new Date(anio, mes - 1, dia)

  if (
    nacimiento.getFullYear() !== anio ||
    nacimiento.getMonth() !== mes - 1 ||
    nacimiento.getDate() !== dia
  ) {
    throw new Error('Fecha de nacimiento inválida')
  }

  const hoy = new Date()

  if (nacimiento > hoy) {
    throw new Error('La fecha de nacimiento no puede ser futura')
  }

  let meses =
    (hoy.getFullYear() - anio) * 12 +
    (hoy.getMonth() - (mes - 1))

  // Si todavía no se cumple el día del mes, restamos un mes.
  if (hoy.getDate() < dia) {
    meses--
  }

  return Math.max(0, meses)
}
