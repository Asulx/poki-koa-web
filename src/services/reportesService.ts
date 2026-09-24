// Simulamos una demora de red para manejar el estado "loading"
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface DatosReporte {
  totalAlertas: number;
  medicamentosAdministrados: number;
  eventosCriticos: number;
}

export const obtenerDatosReporte = async (): Promise<DatosReporte> => {
  await delay(1500); // 1.5 segundos de carga simulada
  
  // Datos falsos estructurados basados en las métricas clave necesarias
  return {
    totalAlertas: 3,
    medicamentosAdministrados: 6,
    eventosCriticos: 14
  };
};