export type EstadoCuna = 'disponible' | 'ocupada' | 'mantenimiento';

export interface Cuna {
  id: string; // Formato requerido: Cuna-01[cite: 16]
  numero: number;
  estado: EstadoCuna;
  pacienteId?: string;
  pacienteNombre?: string; // Para mostrar en estado ocupado[cite: 16]
  alertaMedica?: boolean; // Indicador de constante alerta[cite: 16]
}