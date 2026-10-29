/**
 * @file MedicamentosPage.tsx
 * @description Página única de farmacia con dos pestañas: inventario
 * (`/catalogo-medicamentos/`) y prescripciones (`/medicamentos/`).
 */

import { useEffect, useMemo, useState } from 'react';

import { obtenerMensajeError } from '@/api/axios';
import {
  CatalogoForm,
  PrescripcionForm,
} from '@/components/medicamentos/MedicamentoFormularios';
import Badge from '@/components/ui/Badge/Badge';
import Button from '@/components/ui/Button/Button';
import EstadoVacio from '@/components/ui/EstadoVacio/EstadoVacio';
import Icono from '@/components/ui/Iconos/Iconos';
import Modal from '@/components/ui/Modal/Modal';
import Spinner from '@/components/ui/Spinner/Spinner';
import Table, { type TableColumn } from '@/components/ui/Table/Table';
import { useToast } from '@/context/ToastContext';
import { medicamentosService } from '@/services/medicamentosService';
import { pacientesService } from '@/services/pacientesService';
import type {
  CatalogoPayload,
  Medicamento,
  MedicamentoCatalogo,
  MedicamentoPayload,
} from '@/types/medicamento';
import type { Paciente } from '@/types/paciente';

import './MedicamentosPage.css';

/** Pestaña activa. */
type Pestana = 'inventario' | 'prescripciones';

/** Modal abierto. */
type ModalAbierto = 'catalogo' | 'prescripcion' | null;

/**
 * Gestión de inventario y prescripciones.
 *
 * @returns Pestañas con tablas y formularios modales.
 */
export default function MedicamentosPage() {
  const { exito, error: notificarError } = useToast();

  const [pestana, setPestana] = useState<Pestana>('inventario');
  const [catalogo, setCatalogo] = useState<MedicamentoCatalogo[]>([]);
  const [prescripciones, setPrescripciones] = useState<Medicamento[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [soloStockBajo, setSoloStockBajo] = useState(false);

  const [modal, setModal] = useState<ModalAbierto>(null);
  const [productoEdicion, setProductoEdicion] =
    useState<MedicamentoCatalogo | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [errorFormulario, setErrorFormulario] = useState('');

  /**
   * Carga catálogo, prescripciones y pacientes activos.
   */
  const cargar = async () => {
    setCargando(true);
    setError('');

    try {
      const [listaCatalogo, listaPrescripciones, listaPacientes] =
        await Promise.all([
          medicamentosService.listarCatalogo(),
          medicamentosService.listarPrescripciones(),
          pacientesService.listar({ activo: true }),
        ]);

      setCatalogo(listaCatalogo);
      setPrescripciones(listaPrescripciones);
      setPacientes(listaPacientes);
    } catch (fallo) {
      setError(obtenerMensajeError(fallo));
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    void cargar();
  }, []);

  const catalogoFiltrado = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    return catalogo.filter((item) => {
      const coincideTexto =
        !texto ||
        item.nombre.toLowerCase().includes(texto) ||
        item.principioActivo.toLowerCase().includes(texto);
      const coincideStock = !soloStockBajo || item.stock < 10;
      return coincideTexto && coincideStock;
    });
  }, [catalogo, busqueda, soloStockBajo]);

  const prescripcionesFiltradas = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    return prescripciones.filter(
      (item) =>
        !texto ||
        item.pacienteNombre.toLowerCase().includes(texto) ||
        item.nombre.toLowerCase().includes(texto)
    );
  }, [prescripciones, busqueda]);

  const pendientes = prescripciones.filter(
    (item) => item.estado === 'Pendiente'
  ).length;
  const stockCritico = catalogo.filter((item) => item.stock < 10).length;

  /**
   * Abre el formulario de catálogo (nuevo o edición).
   *
   * @param producto - Producto a editar o `null` para crear.
   */
  const abrirCatalogo = (producto: MedicamentoCatalogo | null) => {
    setProductoEdicion(producto);
    setErrorFormulario('');
    setModal('catalogo');
  };

  /**
   * Guarda un producto del catálogo.
   *
   * @param datos - Payload validado.
   */
  const guardarCatalogo = async (datos: CatalogoPayload) => {
    setGuardando(true);
    setErrorFormulario('');
    try {
      if (productoEdicion) {
        await medicamentosService.actualizarCatalogo(productoEdicion.id, datos);
        exito('Producto actualizado en el inventario.');
      } else {
        await medicamentosService.crearCatalogo(datos);
        exito('Producto agregado al inventario.');
      }
      setModal(null);
      await cargar();
    } catch (fallo) {
      setErrorFormulario(obtenerMensajeError(fallo));
    } finally {
      setGuardando(false);
    }
  };

  /**
   * Guarda una prescripción nueva.
   *
   * @param datos - Payload validado.
   */
  const guardarPrescripcion = async (datos: MedicamentoPayload) => {
    setGuardando(true);
    setErrorFormulario('');
    try {
      await medicamentosService.crearPrescripcion(datos);
      exito('Prescripción registrada.');
      setModal(null);
      await cargar();
    } catch (fallo) {
      setErrorFormulario(obtenerMensajeError(fallo));
    } finally {
      setGuardando(false);
    }
  };

  /**
   * Marca una prescripción como administrada.
   *
   * @param prescripcion - Prescripción seleccionada.
   */
  const administrar = async (prescripcion: Medicamento) => {
    try {
      await medicamentosService.administrar(prescripcion.id);
      exito(
        `${prescripcion.nombre} administrado a ${prescripcion.pacienteNombre}.`
      );
      await cargar();
    } catch (fallo) {
      notificarError(obtenerMensajeError(fallo));
    }
  };

  const columnasCatalogo: TableColumn<MedicamentoCatalogo>[] = [
    {
      key: 'nombre',
      label: 'Medicamento',
      render: (fila) => (
        <div>
          <p className="farmacia__fuerte">{fila.nombre}</p>
          <p className="farmacia__secundario">{fila.principioActivo}</p>
        </div>
      ),
    },
    {
      key: 'dosisMg',
      label: 'Dosis',
      render: (fila) => <span className="texto-mono">{fila.dosisMg} mg</span>,
    },
    {
      key: 'stock',
      label: 'Stock',
      render: (fila) => (
        <Badge
          tono={
            fila.stock < 10 ? 'critico' : fila.stock < 30 ? 'aviso' : 'exito'
          }
          punto
        >
          {fila.stock} unidades
        </Badge>
      ),
    },
    {
      key: 'acciones',
      label: 'Acciones',
      align: 'right',
      render: (fila) => (
        <Button
          variante="fantasma"
          tamano="sm"
          onClick={() => abrirCatalogo(fila)}
        >
          Editar
        </Button>
      ),
    },
  ];

  const columnasPrescripciones: TableColumn<Medicamento>[] = [
    {
      key: 'paciente',
      label: 'Paciente',
      render: (fila) => (
        <div>
          <p className="farmacia__fuerte">{fila.pacienteNombre}</p>
          <p className="farmacia__secundario">Cuna {fila.cuna}</p>
        </div>
      ),
    },
    {
      key: 'medicamento',
      label: 'Prescripción',
      render: (fila) => (
        <div>
          <p className="farmacia__fuerte">{fila.nombre}</p>
          <p className="farmacia__secundario">{fila.dosis}</p>
        </div>
      ),
    },
    { key: 'via', label: 'Vía' },
    {
      key: 'hora',
      label: 'Hora',
      render: (fila) => <span className="texto-mono">{fila.hora}</span>,
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (fila) => (
        <Badge tono={fila.estado === 'Administrado' ? 'exito' : 'aviso'} punto>
          {fila.estado}
        </Badge>
      ),
    },
    {
      key: 'acciones',
      label: 'Acciones',
      align: 'right',
      render: (fila) =>
        fila.estado === 'Pendiente' ? (
          <Button
            variante="exito"
            tamano="sm"
            onClick={() => void administrar(fila)}
          >
            Administrar
          </Button>
        ) : (
          <span className="farmacia__secundario">Registrado</span>
        ),
    },
  ];

  return (
    <div className="pagina farmacia">
      <header className="pagina__cabecera">
        <div>
          <h2 className="pagina__titulo">Medicamentos</h2>
          <p className="pagina__descripcion">
            {pendientes} prescripciones pendientes · {stockCritico} productos
            con stock crítico.
          </p>
        </div>
        <div className="pagina__acciones">
          <Button
            variante="secundario"
            onClick={() => void cargar()}
            cargando={cargando}
          >
            Actualizar
          </Button>
          {pestana === 'inventario' ? (
            <Button
              icono={<Icono nombre="mas" tamano={15} />}
              onClick={() => abrirCatalogo(null)}
            >
              Nuevo medicamento
            </Button>
          ) : (
            <Button
              icono={<Icono nombre="mas" tamano={15} />}
              onClick={() => {
                setErrorFormulario('');
                setModal('prescripcion');
              }}
            >
              Nueva prescripción
            </Button>
          )}
        </div>
      </header>

      <div
        className="farmacia__pestanas"
        role="tablist"
        aria-label="Secciones de farmacia"
      >
        <button
          type="button"
          role="tab"
          aria-selected={pestana === 'inventario'}
          className={`farmacia__pestana ${pestana === 'inventario' ? 'farmacia__pestana--activa' : ''}`}
          onClick={() => {
            setPestana('inventario');
            setBusqueda('');
          }}
        >
          <Icono nombre="medicamentos" tamano={15} />
          Inventario
          <span className="farmacia__contador">{catalogo.length}</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={pestana === 'prescripciones'}
          className={`farmacia__pestana ${pestana === 'prescripciones' ? 'farmacia__pestana--activa' : ''}`}
          onClick={() => {
            setPestana('prescripciones');
            setBusqueda('');
          }}
        >
          <Icono nombre="planes" tamano={15} />
          Prescripciones
          <span className="farmacia__contador">{prescripciones.length}</span>
        </button>
      </div>

      <div className="farmacia__herramientas">
        <div className="farmacia__buscador">
          <Icono nombre="buscar" tamano={16} />
          <input
            type="search"
            value={busqueda}
            onChange={(evento) => setBusqueda(evento.target.value)}
            placeholder={
              pestana === 'inventario'
                ? 'Buscar medicamento o principio activo…'
                : 'Buscar por paciente o medicamento…'
            }
            aria-label="Buscar en medicamentos"
          />
        </div>

        {pestana === 'inventario' && (
          <label className="farmacia__check">
            <input
              type="checkbox"
              checked={soloStockBajo}
              onChange={(evento) => setSoloStockBajo(evento.target.checked)}
            />
            Solo stock crítico (&lt; 10)
          </label>
        )}
      </div>

      {error && (
        <div className="mensaje mensaje--error" role="alert">
          <span aria-hidden="true">!</span>
          <span>{error}</span>
        </div>
      )}

      {cargando ? (
        <Spinner bloque texto="Cargando farmacia…" />
      ) : pestana === 'inventario' ? (
        catalogoFiltrado.length === 0 ? (
          <EstadoVacio
            titulo="Sin productos en el inventario"
            texto="Agrega el primer medicamento o ajusta la búsqueda."
            icono={<Icono nombre="medicamentos" tamano={28} />}
            accion={
              <Button onClick={() => abrirCatalogo(null)}>
                Agregar medicamento
              </Button>
            }
          />
        ) : (
          <section className="tarjeta tarjeta--sin-relleno">
            <Table
              columns={columnasCatalogo}
              data={catalogoFiltrado}
              rowKey={(fila) => fila.id}
              etiqueta="Inventario de medicamentos"
            />
          </section>
        )
      ) : prescripcionesFiltradas.length === 0 ? (
        <EstadoVacio
          titulo="Sin prescripciones registradas"
          texto="Crea una prescripción para un paciente activo."
          icono={<Icono nombre="planes" tamano={28} />}
          accion={
            <Button onClick={() => setModal('prescripcion')}>
              Nueva prescripción
            </Button>
          }
        />
      ) : (
        <section className="tarjeta tarjeta--sin-relleno">
          <Table
            columns={columnasPrescripciones}
            data={prescripcionesFiltradas}
            rowKey={(fila) => fila.id}
            etiqueta="Prescripciones de medicamentos"
          />
        </section>
      )}

      <Modal
        abierto={modal === 'catalogo'}
        titulo={productoEdicion ? 'Editar medicamento' : 'Nuevo medicamento'}
        descripcion="El inventario es independiente de las prescripciones por paciente."
        onCerrar={() => {
          if (!guardando) setModal(null);
        }}
        pie={undefined}
      >
        <CatalogoForm
          producto={productoEdicion ?? undefined}
          guardando={guardando}
          error={errorFormulario}
          onSubmit={guardarCatalogo}
          onCancelar={() => setModal(null)}
        />
      </Modal>

      <Modal
        abierto={modal === 'prescripcion'}
        titulo="Nueva prescripción"
        descripcion="Solo se listan pacientes activos de la unidad."
        onCerrar={() => {
          if (!guardando) setModal(null);
        }}
        ancho="lg"
      >
        <PrescripcionForm
          pacientes={pacientes}
          guardando={guardando}
          error={errorFormulario}
          onSubmit={guardarPrescripcion}
          onCancelar={() => setModal(null)}
        />
      </Modal>
    </div>
  );
}
