import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Cuna, EstadoCuna } from '@/types/cuna';
import './MapaCunas.css';

// Generador adaptado al formato "Cuna-01"[cite: 16]
const generarCunasBase = (): Cuna[] => {
  return Array.from({ length: 40 }, (_, index) => {
    const numero = index + 1;
    const numeroFormateado = numero < 10 ? `0${numero}` : `${numero}`;
    return {
      id: `Cuna-${numeroFormateado}`,
      numero,
      estado: 'disponible',
    };
  });
};

export default function MapaCunasPage() {
  const navigate = useNavigate();
  const [cunas, setCunas] = useState<Cuna[]>(generarCunasBase());
  
  // Estados para Búsqueda y Filtros[cite: 17]
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<EstadoCuna | 'todos'>('todos');

  // Lógica de filtrado cruda
  const cunasFiltradas = useMemo(() => {
    return cunas.filter((cuna) => {
      const coincideEstado = filtroEstado === 'todos' || cuna.estado === filtroEstado;
      const terminoBusqueda = busqueda.toLowerCase();
      const coincideBusqueda = 
        cuna.id.toLowerCase().includes(terminoBusqueda) ||
        (cuna.pacienteNombre?.toLowerCase().includes(terminoBusqueda) ?? false);
        
      return coincideEstado && coincideBusqueda;
    });
  }, [cunas, busqueda, filtroEstado]);

  // Manejador de clics según Escenarios BDD[cite: 17]
  const manejarClicCuna = (cuna: Cuna) => {
    if (cuna.estado === 'ocupada') {
      // Escenario 1: Redirigir a vista detallada[cite: 17]
      navigate(`/pacientes/${cuna.pacienteId}`);
    } else if (cuna.estado === 'disponible') {
      // Escenario 2: Abrir modal de asignación (Por ahora un log)[cite: 17]
      console.log(`Abrir modal para asignar paciente a ${cuna.id}`);
    }
  };

  return (
    <div className="mapa-container">
      <header className="mapa-header">
        <h2>Unidad de Neonatología</h2>
        
        {/* Controles de Filtro y Búsqueda[cite: 17] */}
        <div className="controles-busqueda">
          <input 
            type="text" 
            placeholder="Buscar por cuna o paciente..." 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="input-busqueda"
          />
          <select 
            value={filtroEstado} 
            onChange={(e) => setFiltroEstado(e.target.value as EstadoCuna | 'todos')}
            className="select-filtro"
          >
            <option value="todos">Todos los estados</option>
            <option value="disponible">Disponibles</option>
            <option value="ocupada">Ocupadas</option>
            <option value="mantenimiento">Mantenimiento</option>
          </select>
        </div>
      </header>
      
      <main className="grid-cunas">
        {cunasFiltradas.map((cuna) => (
          <div 
            key={cuna.id} 
            className={`cuna-card estado-${cuna.estado}`}
            onClick={() => manejarClicCuna(cuna)}
          >
            <div className="cuna-header">
              <span className="cuna-numero">{cuna.id}</span>
              {cuna.alertaMedica && <span className="icono-alerta">⚠️</span>} {/* Indicador alerta[cite: 16] */}
            </div>
            
            <div className="cuna-cuerpo">
              <span className="cuna-estado">{cuna.estado}</span>
              {cuna.estado === 'ocupada' && cuna.pacienteNombre && (
                <span className="cuna-paciente">{cuna.pacienteNombre}</span>
              )}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}