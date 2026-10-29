/**
 * @file PacientesPage.tsx
 * @description Listado clínico de pacientes con búsqueda, filtros, paginación
 * en cliente y registro de alta hospitalaria.
 */

import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { obtenerMensajeError } from '@/api/axios';
import Badge from '@/components/ui/Badge/Badge';
import Button from '@/components/ui/Button/Button';
import EstadoVacio from '@/components/ui/EstadoVacio/EstadoVacio';
import Icono from '@/components/ui/Iconos/Iconos';
import Modal from '@/components/ui/Modal/Modal';
import Spinner from '@/components/ui/Spinner/Spinner';
import Table, { type TableColumn } from '@/components/ui/Table/Table';
import { useToast } from '@/context/ToastContext';
import { pacientesService } from '@/services/pacientesService';
import type { Paciente } from '@/types/paciente';
import { formatearFecha, formatearEdadGestacional } from '@/utils/fechas';
import { formatearEdadMeses, truncar } from '@/utils/calculos';

import './PacientesPage.css';

/** Filtros del listado. */
type FiltroEstado = 'todos' | 'activos' | 'alta';
type FiltroSexo = 'todos' | 'F' | 'M';

/** Cantidad de filas por página. */
const POR_PAGINA = 8;

/**
 * Listado de pacientes.
 *
 * @returns Tabla con búsqueda, filtros y acciones.
 */
export default function PacientesPage() {
  const navegar = useNavigate();
  const { exito, error: notificarError } = useToast();

  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [estado, setEstado] = useState<FiltroEstado>('activos');
  const [sexo, setSexo] = useState<FiltroSexo>('todos');
  const [pagina, setPagina] = useState(1);

  const [pacienteAlta, setPacienteAlta] = useState<Paciente | null>(null);
  const [motivo, setMotivo] = useState('');
  const [procesando, setProcesando] = useState(false);

  /**
   * Carga todos los pacientes desde la API.
   */
  const cargar = async () => {
    setCargando(true);
    setError('');
    try {
      setPacientes(await pacientesService.listar());
    } catch (fallo) {
      setError(obtenerMensajeError(fallo));
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    void cargar();
  }, []);

  const filtrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    return pacientes.filter((paciente) => {
      const coincideTexto =
        !texto ||
        paciente.nombreCompleto.toLowerCase().includes(texto) ||
        paciente.identificador.toLowerCase().includes(texto) ||
        (paciente.medicoNombre ?? '').toLowerCase().includes(texto);

      const coincideEstado =
        estado === 'todos' ||
        (estado === 'activos' && paciente.activo) ||
        (estado === 'alta' && !paciente.activo);

      const coincideSexo = sexo === 'todos' || paciente.sexo === sexo;

      return coincideTexto && coincideEstado && coincideSexo;
    });
  }, [pacientes, busqueda, estado, sexo]);

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA));
  const paginaActual = Math.min(pagina, totalPaginas);
  const visibles = filtrados.slice(
    (paginaActual - 1) * POR_PAGINA,
    paginaActual * POR_PAGINA
  );

  const activos = pacientes.filter((paciente) => paciente.activo).length;
  const conCuna = pacientes.filter((paciente) => paciente.cunaId).length;

  /**
   * Registra el alta del paciente seleccionado.
   */
  const confirmarAlta = async () => {
    if (!pacienteAlta) return;

    if (motivo.trim().length < 3) {
      notificarError('Describe el motivo del alta (mínimo 3 caracteres).');
      return;
    }

    setProcesando(true);
    try {
      await pacientesService.darDeAlta(pacienteAlta.id, motivo.trim());
      exito(`Alta registrada para ${pacienteAlta.nombreCompleto}.`);
      setPacienteAlta(null);
      setMotivo('');
      await cargar();
    } catch (fallo) {
      notificarError(obtenerMensajeError(fallo));
    } finally {
      setProcesando(false);
    }
  };

  const columnas: TableColumn<Paciente>[] = [
    {
      key: 'paciente',
      label: 'Paciente',
      render: (fila) => (
        <div className="pacientes__celda-paciente">
          <span className="pacientes__avatar" aria-hidden="true">
            {fila.nombreCompleto.slice(0, 2).toUpperCase()}
          </span>
          <div>
            <p className="pacientes__nombre">{fila.nombreCompleto}</p>
            <p className="pacientes__identificador">{fila.identificador}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'sexo',
      label: 'Sexo',
      render: (fila) => (fila.sexo === 'F' ? 'Femenino' : 'Masculino'),
    },
    {
      key: 'edad',
      label: 'Edad',
      render: (fila) => (
        <span>
          {formatearEdadMeses(fila.edadMeses)}
          <span className="pacientes__secundario">
            {' · '}
            {formatearEdadGestacional(fila.edadGestacional)}
          </span>
        </span>
      ),
    },
    {
      key: 'cuna',
      label: 'Cuna',
      render: (fila) =>
        fila.cunaIdentificador ? (
          <span className="pacientes__cuna">{fila.cunaIdentificador}</span>
        ) : (
          <span className="texto-muted">Sin cuna</span>
        ),
    },
    {
      key: 'medico',
      label: 'Médico a cargo',
      render: (fila) => (
        <span title={fila.medicoNombre ?? ''}>
          {fila.medicoNombre ? truncar(fila.medicoNombre, 26) : '—'}
        </span>
      ),
    },
    {
      key: 'ingreso',
      label: 'Ingreso',
      render: (fila) => formatearFecha(fila.fechaIngreso),
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (fila) => (
        <Badge tono={fila.activo ? 'exito' : 'neutro'} punto>
          {fila.activo ? 'Activo' : 'Alta'}
        </Badge>
      ),
    },
    {
      key: 'acciones',
      label: 'Acciones',
      align: 'right',
      render: (fila) => (
        <div className="pacientes__acciones">
          <Button
            variante="fantasma"
            tamano="sm"
            onClick={() => navegar(`/pacientes/${fila.id}`)}
            aria-label={`Ver ficha de ${fila.nombreCompleto}`}
          >
            Ver
          </Button>
          <Button
            variante="fantasma"
            tamano="sm"
            onClick={() => navegar(`/pacientes/${fila.id}/editar`)}
            aria-label={`Editar ${fila.nombreCompleto}`}
          >
            Editar
          </Button>
          {fila.activo && (
            <Button
              variante="fantasma"
              tamano="sm"
              onClick={() => {
                setPacienteAlta(fila);
                setMotivo('');
              }}
            >
              Alta
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="pagina pacientes">
      <header className="pagina__cabecera">
        <div>
          <h2 className="pagina__titulo">Pacientes</h2>
          <p className="pagina__descripcion">
            {activos} pacientes activos · {conCuna} con cuna asignada ·{' '}
            {pacientes.length} registros históricos.
          </p>
        </div>
        <div className="pagina__acciones">
          <Link
            to="/pacientes/nuevo"
            className="boton boton--primario boton--md"
          >
            <Icono nombre="mas" tamano={15} />
            Nuevo paciente
          </Link>
        </div>
      </header>

      <section className="pacientes__filtros" aria-label="Filtros de pacientes">
        <div className="pacientes__buscador">
          <Icono nombre="buscar" tamano={16} />
          <input
            type="search"
            value={busqueda}
            onChange={(evento) => {
              setBusqueda(evento.target.value);
              setPagina(1);
            }}
            placeholder="Buscar por nombre, identificador o médico…"
            aria-label="Buscar paciente"
          />
        </div>

        <div className="pacientes__grupo-filtros">
          <select
            className="campo__control"
            value={estado}
            onChange={(evento) => {
              setEstado(evento.target.value as FiltroEstado);
              setPagina(1);
            }}
            aria-label="Filtrar por estado"
          >
            <option value="activos">Solo activos</option>
            <option value="todos">Todos los estados</option>
            <option value="alta">Dados de alta</option>
          </select>

          <select
            className="campo__control"
            value={sexo}
            onChange={(evento) => {
              setSexo(evento.target.value as FiltroSexo);
              setPagina(1);
            }}
            aria-label="Filtrar por sexo"
          >
            <option value="todos">Todos los sexos</option>
            <option value="F">Femenino</option>
            <option value="M">Masculino</option>
          </select>

          <Button
            variante="secundario"
            onClick={() => void cargar()}
            cargando={cargando}
          >
            Actualizar
          </Button>
        </div>
      </section>

      {error && (
        <div className="mensaje mensaje--error" role="alert">
          <span aria-hidden="true">!</span>
          <span>{error}</span>
        </div>
      )}

      {cargando ? (
        <Spinner bloque texto="Cargando pacientes…" />
      ) : visibles.length === 0 ? (
        <EstadoVacio
          titulo="No se encontraron pacientes"
          texto="Ajusta los filtros o registra un nuevo ingreso."
          icono={<Icono nombre="pacientes" tamano={28} />}
          accion={
            <Link
              to="/pacientes/nuevo"
              className="boton boton--primario boton--md"
            >
              Registrar paciente
            </Link>
          }
        />
      ) : (
        <section className="tarjeta tarjeta--sin-relleno">
          <Table
            columns={columnas}
            data={visibles}
            rowKey={(fila) => fila.id}
            etiqueta="Listado de pacientes"
            onRowClick={(fila) => navegar(`/pacientes/${fila.id}`)}
          />
        </section>
      )}

      <footer className="pacientes__pie">
        <p>
          Mostrando {visibles.length} de {filtrados.length} pacientes
        </p>
        <div className="pacientes__paginacion">
          <Button
            variante="secundario"
            tamano="sm"
            disabled={paginaActual <= 1}
            onClick={() => setPagina((valor) => Math.max(1, valor - 1))}
          >
            Anterior
          </Button>
          <span>
            Página {paginaActual} de {totalPaginas}
          </span>
          <Button
            variante="secundario"
            tamano="sm"
            disabled={paginaActual >= totalPaginas}
            onClick={() =>
              setPagina((valor) => Math.min(totalPaginas, valor + 1))
            }
          >
            Siguiente
          </Button>
        </div>
      </footer>

      <Modal
        abierto={Boolean(pacienteAlta)}
        titulo={`Dar de alta a ${pacienteAlta?.nombreCompleto ?? ''}`}
        descripcion="El paciente quedará inactivo y su cuna será liberada."
        onCerrar={() => {
          if (!procesando) {
            setPacienteAlta(null);
            setMotivo('');
          }
        }}
        ancho="sm"
        pie={
          <>
            <Button
              variante="secundario"
              onClick={() => setPacienteAlta(null)}
              disabled={procesando}
            >
              Cancelar
            </Button>
            <Button
              variante="peligro"
              onClick={() => void confirmarAlta()}
              cargando={procesando}
            >
              Confirmar alta
            </Button>
          </>
        }
      >
        <div className="campo">
          <label className="campo__label" htmlFor="motivo-alta">
            Motivo del alta *
          </label>
          <textarea
            id="motivo-alta"
            className="campo__control"
            value={motivo}
            onChange={(evento) => setMotivo(evento.target.value)}
            placeholder="Ej. Mejoría clínica, traslado a otro servicio…"
          />
        </div>
      </Modal>
    </div>
  );
}
