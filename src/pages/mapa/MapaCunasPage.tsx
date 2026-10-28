import { api } from '@/api/axios';
import ModalAsignacion from './ModalAsignacion';
import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Cuna, EstadoCuna } from '@/types/cuna';
import './MapaCunas.css';

/**
 * Genera una estructura inicial de 40 cunas base para el mapa de la unidad.
 *
 * @returns Un arreglo de objetos {@link Cuna} con estado inicial disponible.
 */
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

/**
 * Componente de página del mapa interactivo de cunas de la Unidad de Neonatología.
 * Gestiona la sincronización en tiempo real mediante WebSockets, solicitudes HTTP,
 * filtrado por estado/búsqueda y la interacción con modales de asignación o vistas detalladas.
 *
 * @returns Un elemento JSX que representa la interfaz completa del mapa de cunas.
 */
export default function MapaCunasPage() {
  const navigate = useNavigate();
  const [cunas, setCunas] = useState<Cuna[]>(generarCunasBase());
  const [cunaParaAsignar, setCunaParaAsignar] = useState<Cuna | null>(null);

  // Estados para Búsqueda y Filtros
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<EstadoCuna | 'todos'>(
    'todos'
  );

  // Carga inicial y conexión WebSocket para tiempo real
  useEffect(() => {
    // 1. Carga inicial tradicional (HTTP GET) para tener los datos de inmediato
    const obtenerCunas = async () => {
      try {
        const respuesta = await api.get('/api/cots');
        const cunasDelBackend = Array.isArray(respuesta.data)
          ? respuesta.data
          : respuesta.data?.data || [];

        if (cunasDelBackend.length > 0) {
          setCunas(cunasDelBackend);
        }
      } catch (error) {
        console.error('Error al obtener cunas iniciales:', error);
      }
    };
    obtenerCunas();

    // 2. Abrir el túnel WebSocket hacia el backend
    // Nota: Ajusta el puerto (8000) si tu backend de Django corre en otro puerto
    const socket = new WebSocket('ws://localhost:8000/ws/cots/');

    socket.onopen = () => {
      console.log('Conectado al servidor de tiempo real de Poki Koa');
    };

    socket.onmessage = (event) => {
      const mensaje = JSON.parse(event.data);

      if (mensaje.type === 'actualizacion_cuna') {
        const cunaActualizada = mensaje.data;

        // Actualizamos solo la cuna que cambió dentro del estado de React
        setCunas((cunasAnteriores) =>
          cunasAnteriores.map((cuna) =>
            cuna.id === cunaActualizada.id ? cunaActualizada : cuna
          )
        );
      }
    };

    socket.onerror = (error) => {
      console.error('Error en el túnel WebSocket:', error);
    };

    // 3. Programación defensiva: cerrar el túnel si el usuario sale del mapa
    return () => {
      socket.close();
    };
  }, []);

  // Lógica de filtrado cruda
  const cunasFiltradas = useMemo(() => {
    return cunas.filter((cuna) => {
      const coincideEstado =
        filtroEstado === 'todos' || cuna.estado === filtroEstado;
      const terminoBusqueda = busqueda.toLowerCase();
      const coincideBusqueda =
        cuna.id.toLowerCase().includes(terminoBusqueda) ||
        (cuna.pacienteNombre?.toLowerCase().includes(terminoBusqueda) ?? false);

      return coincideEstado && coincideBusqueda;
    });
  }, [cunas, busqueda, filtroEstado]);

  // Manejador de clics según Escenarios BDD
  const manejarClicCuna = (cuna: Cuna) => {
    if (cuna.estado === 'ocupada') {
      // Escenario 1: Redirigir a vista detallada
      navigate(`/pacientes/${cuna.pacienteId}`);
    } else if (cuna.estado === 'disponible') {
      // Escenario 2: Abrir modal de asignación
      setCunaParaAsignar(cuna);
    }
  };

  return (
    <div className="mapa-container">
      <header className="mapa-header">
        <h2>Unidad de Neonatología</h2>

        {/* Controles de Filtro y Búsqueda */}
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
            onChange={(e) =>
              setFiltroEstado(e.target.value as EstadoCuna | 'todos')
            }
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
              {cuna.alertaMedica && <span className="icono-alerta">⚠️</span>}
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

      {/* Modal de Asignación */}
      {cunaParaAsignar && (
        <ModalAsignacion
          cuna={cunaParaAsignar}
          onClose={() => setCunaParaAsignar(null)}
          onAsignar={(pacienteNombre) => {
            console.log(
              `Simulando asignación de ${pacienteNombre} a ${cunaParaAsignar.id}`
            );
            setCunaParaAsignar(null);
          }}
        />
      )}
    </div>
  );
}
