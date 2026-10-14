import Button from '@/components/ui/Button/Button'

import './PacientesFiltros.css'

type PacientesFiltrosProps = {
  busqueda: string
  sexo: string
  fechaIngreso: string
  estadoCanula: string
  onBusquedaChange: (value: string) => void
  onSexoChange: (value: string) => void
  onFechaIngresoChange: (value: string) => void
  onEstadoCanulaChange: (value: string) => void
  onLimpiar: () => void
}

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
    estadoCanula !== ''

  return (
    <section className="pacientes-filtros">
      <div className="pacientes-filtros__busqueda">
        <label htmlFor="busqueda-paciente">
          Buscar paciente
        </label>

        <input
          id="busqueda-paciente"
          type="search"
          placeholder="Buscar por nombre o identificador"
          value={busqueda}
          onChange={(event) =>
            onBusquedaChange(event.target.value)
          }
        />
      </div>

      <div className="pacientes-filtros__controles">
        <div className="pacientes-filtros__campo">
          <label htmlFor="filtro-sexo">
            Sexo
          </label>

          <select
            id="filtro-sexo"
            value={sexo}
            onChange={(event) =>
              onSexoChange(event.target.value)
            }
          >
            <option value="">Todos</option>
            <option value="Masculino">
              Masculino
            </option>
            <option value="Femenino">
              Femenino
            </option>
          </select>
        </div>

        <div className="pacientes-filtros__campo">
          <label htmlFor="filtro-fecha-ingreso">
            Fecha de ingreso
          </label>

          <input
            id="filtro-fecha-ingreso"
            type="date"
            value={fechaIngreso}
            onChange={(event) =>
              onFechaIngresoChange(
                event.target.value
              )
            }
          />
        </div>

        <div className="pacientes-filtros__campo">
          <label htmlFor="filtro-canula">
            Estado de cánula
          </label>

          <select
            id="filtro-canula"
            value={estadoCanula}
            onChange={(event) =>
              onEstadoCanulaChange(
                event.target.value
              )
            }
          >
            <option value="">Todos</option>
            <option value="OK">OK</option>
            <option value="Pendiente">
              Pendiente
            </option>
          </select>
        </div>

        <div className="pacientes-filtros__accion">
          <Button
            disabled={!hayFiltrosActivos}
            onClick={onLimpiar}
          >
            Limpiar filtros
          </Button>
        </div>
      </div>
    </section>
  )
}