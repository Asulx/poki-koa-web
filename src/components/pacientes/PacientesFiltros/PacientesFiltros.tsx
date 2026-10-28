import Button from '@/components/ui/Button/Button';

import './PacientesFiltros.css';

/**
 * Propiedades requeridas para el componente PacientesFiltros.
 * Define los valores actuales de los filtros y las funciones de callback
 * para actualizar cada campo o restablecer la vista.
 */
type PacientesFiltrosProps = {
  /** Valor actual del campo de búsqueda por nombre o identificador. */
  busqueda: string;
  /** Valor actual del filtro de sexo del paciente. */
  sexo: string;
  /** Valor actual del filtro de fecha de ingreso. */
  fechaIngreso: string;
  /** Valor actual del filtro por estado de cánula. */
  estadoCanula: string;
  /** Función ejecutada al modificar el texto de búsqueda. */
  onBusquedaChange: (value: string) => void;
  /** Función ejecutada al cambiar el filtro de sexo. */
  onSexoChange: (value: string) => void;
  /** Función ejecutada al cambiar la fecha de ingreso. */
  onFechaIngresoChange: (value: string) => void;
  /** Función ejecutada al cambiar el estado de la cánula. */
  onEstadoCanulaChange: (value: string) => void;
  /** Función ejecutada para restablecer todos los filtros a su estado inicial. */
  onLimpiar: () => void;
};

/**
 * Componente de filtrado avanzado para la lista de pacientes.
 * Permite buscar por texto libre y filtrar por múltiples criterios clínicos y demográficos,
 * además de proveer un botón reactivo para limpiar dichos filtros.
 *
 * @param props Contiene los valores de los filtros y las funciones manejadoras de estado.
 * @returns Una sección HTML estructurada con los controles de búsqueda y filtrado.
 */
export default function PacientesFiltros({
  busqueda,
  sexo,
  fechaIngreso,
  estadoCanula,
  onBusquedaChange,
  onSexoChange,
  onFechaIngresoChange,
  onEstadoCanulaChange,
  onLimpiar,
}: PacientesFiltrosProps) {
  const hayFiltrosActivos =
    busqueda !== '' ||
    sexo !== '' ||
    fechaIngreso !== '' ||
    estadoCanula !== '';

  return (
    <section className="pacientes-filtros">
      <div className="pacientes-filtros__busqueda">
        <label htmlFor="busqueda-paciente">Buscar paciente</label>

        <input
          id="busqueda-paciente"
          type="search"
          placeholder="Buscar por nombre o identificador"
          value={busqueda}
          onChange={(event) => onBusquedaChange(event.target.value)}
        />
      </div>

      <div className="pacientes-filtros__controles">
        <div className="pacientes-filtros__campo">
          <label htmlFor="filtro-sexo">Sexo</label>

          <select
            id="filtro-sexo"
            value={sexo}
            onChange={(event) => onSexoChange(event.target.value)}
          >
            <option value="">Todos</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
          </select>
        </div>

        <div className="pacientes-filtros__campo">
          <label htmlFor="filtro-fecha-ingreso">Fecha de ingreso</label>

          <input
            id="filtro-fecha-ingreso"
            type="date"
            value={fechaIngreso}
            onChange={(event) => onFechaIngresoChange(event.target.value)}
          />
        </div>

        <div className="pacientes-filtros__campo">
          <label htmlFor="filtro-canula">Estado de cánula</label>

          <select
            id="filtro-canula"
            value={estadoCanula}
            onChange={(event) => onEstadoCanulaChange(event.target.value)}
          >
            <option value="">Todos</option>
            <option value="OK">OK</option>
            <option value="Pendiente">Pendiente</option>
          </select>
        </div>

        <div className="pacientes-filtros__accion">
          <Button disabled={!hayFiltrosActivos} onClick={onLimpiar}>
            Limpiar filtros
          </Button>
        </div>
      </div>
    </section>
  );
}
