/**
 * @file PacienteDetallePage.tsx
 * @description Ficha clínica del paciente: identificación, signos vitales,
 * prescripciones, planes de cuidado, alertas y registro de alta.
 */

import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { obtenerMensajeError } from '@/api/axios';
import Badge from '@/components/ui/Badge/Badge';
import Button from '@/components/ui/Button/Button';
import Icono from '@/components/ui/Iconos/Iconos';
import Modal from '@/components/ui/Modal/Modal';
import Spinner from '@/components/ui/Spinner/Spinner';
import Table, { type TableColumn } from '@/components/ui/Table/Table';
import { useToast } from '@/context/ToastContext';
import { pacientesService } from '@/services/pacientesService';
import { planesService } from '@/services/planesService';
import type { Medicamento } from '@/types/medicamento';
import type { Paciente } from '@/types/paciente';
import type { PlanCuidado } from '@/types/plan';
import { formatearEdadMeses, signoEnRango } from '@/utils/calculos';
import {
  formatearEdadGestacional,
  formatearFecha,
  formatearFechaHora,
} from '@/utils/fechas';

import './PacienteDetalle.css';

/**
 * Ficha clínica individual.
 *
 * @returns Detalle del paciente con sus relaciones.
 */
export default function PacienteDetallePage() {
  const { id } = useParams<{ id: string }>();
  const navegar = useNavigate();
  const { exito, error: notificarError } = useToast();

  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [planes, setPlanes] = useState<PlanCuidado[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const [altaAbierta, setAltaAbierta] = useState(false);
  const [motivo, setMotivo] = useState('');
  const [procesando, setProcesando] = useState(false);

  /**
   * Carga la ficha y sus planes de cuidado.
   */
  const cargar = async () => {
    if (!id) return;
    setCargando(true);
    setError('');

    try {
      const datos = await pacientesService.obtener(Number(id));
      setPaciente(datos);

      try {
        setPlanes(await planesService.listar({ pacienteId: datos.id }));
      } catch {
        setPlanes([]);
      }
    } catch (fallo) {
      setError(obtenerMensajeError(fallo));
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    void cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  /**
   * Registra el alta y vuelve al listado.
   */
  const confirmarAlta = async () => {
    if (!paciente) return;
    if (motivo.trim().length < 3) {
      notificarError('Describe el motivo del alta (mínimo 3 caracteres).');
      return;
    }

    setProcesando(true);
    try {
      await pacientesService.darDeAlta(paciente.id, motivo.trim());
      exito(`Alta registrada para ${paciente.nombreCompleto}.`);
      setAltaAbierta(false);
      navegar('/pacientes', { replace: true });
    } catch (fallo) {
      notificarError(obtenerMensajeError(fallo));
    } finally {
      setProcesando(false);
    }
  };

  if (cargando) {
    return <Spinner bloque texto="Cargando ficha clínica…" />;
  }

  if (!paciente) {
    return (
      <div className="pagina">
        <div className="mensaje mensaje--error" role="alert">
          <span aria-hidden="true">!</span>
          <span>{error || 'No se encontró el paciente solicitado.'}</span>
        </div>
        <Link to="/pacientes" className="boton boton--secundario boton--md">
          Volver al listado
        </Link>
      </div>
    );
  }

  const columnasMedicamentos: TableColumn<Medicamento>[] = [
    {
      key: 'nombre',
      label: 'Medicamento',
      render: (fila) => (
        <div>
          <p className="ficha__fuerte">{fila.nombre}</p>
          <p className="ficha__secundario">{fila.dosis}</p>
        </div>
      ),
    },
    { key: 'via', label: 'Vía' },
    { key: 'hora', label: 'Hora' },
    {
      key: 'estado',
      label: 'Estado',
      render: (fila) => (
        <Badge tono={fila.estado === 'Administrado' ? 'exito' : 'aviso'} punto>
          {fila.estado}
        </Badge>
      ),
    },
  ];

  const activo = paciente.activo;

  return (
    <div className="pagina ficha">
      <header className="pagina__cabecera">
        <div>
          <Link to="/pacientes" className="pagina__volver">
            <Icono nombre="volver" tamano={14} />
            Volver al listado
          </Link>
          <div className="ficha__identidad">
            <span className="ficha__avatar" aria-hidden="true">
              {paciente.nombreCompleto.slice(0, 2).toUpperCase()}
            </span>
            <div>
              <h2 className="pagina__titulo">{paciente.nombreCompleto}</h2>
              <p className="ficha__meta">
                <span className="texto-mono">{paciente.identificador}</span>
                {' · '}
                {paciente.sexo === 'F' ? 'Femenino' : 'Masculino'}
                {' · '}
                {formatearEdadMeses(paciente.edadMeses)}
                {' · '}
                {paciente.edadGestacional
                  ? `${formatearEdadGestacional(paciente.edadGestacional)} de gestación`
                  : 'Edad gestacional no registrada'}
              </p>
            </div>
          </div>
        </div>

        <div className="pagina__acciones">
          <Badge tono={activo ? 'exito' : 'neutro'} punto>
            {activo ? 'Hospitalizado' : 'Dado de alta'}
          </Badge>
          <Button
            variante="secundario"
            icono={<Icono nombre="editar" tamano={14} />}
            onClick={() => navegar(`/pacientes/${paciente.id}/editar`)}
          >
            Editar
          </Button>
          {activo && (
            <Button
              variante="peligro"
              icono={<Icono nombre="alta" tamano={14} />}
              onClick={() => {
                setMotivo('');
                setAltaAbierta(true);
              }}
            >
              Dar de alta
            </Button>
          )}
        </div>
      </header>

      {error && (
        <div className="mensaje mensaje--error" role="alert">
          <span aria-hidden="true">!</span>
          <span>{error}</span>
        </div>
      )}

      <div className="ficha__rejilla">
        <section className="tarjeta">
          <header className="tarjeta__cabecera">
            <h2 className="tarjeta__titulo">Datos generales</h2>
          </header>
          <div className="tarjeta__cuerpo ficha__datos">
            <div>
              <span>Cuna asignada</span>
              <strong>{paciente.cunaIdentificador ?? 'Sin asignar'}</strong>
            </div>
            <div>
              <span>Médico a cargo</span>
              <strong>{paciente.medicoNombre ?? 'Sin asignar'}</strong>
            </div>
            <div>
              <span>Fecha de ingreso</span>
              <strong>{formatearFecha(paciente.fechaIngreso)}</strong>
            </div>
            <div>
              <span>Fecha de nacimiento</span>
              <strong>{formatearFecha(paciente.fechaNacimiento)}</strong>
            </div>
            <div>
              <span>Peso al ingreso</span>
              <strong>{paciente.peso ? `${paciente.peso} kg` : '—'}</strong>
            </div>
            <div>
              <span>Identificador</span>
              <strong className="texto-mono">{paciente.identificador}</strong>
            </div>
          </div>
        </section>

        <section className="tarjeta ficha__vitales-tarjeta">
          <header className="tarjeta__cabecera">
            <h2 className="tarjeta__titulo">Signos vitales</h2>
            <span className="badge badge--info">Última lectura</span>
          </header>
          <div className="tarjeta__cuerpo ficha__vitales">
            <div
              className={
                signoEnRango(
                  'ritmoCardiaco',
                  paciente.signosVitales?.ritmoCardiaco
                )
                  ? 'ficha__vital'
                  : 'ficha__vital ficha__vital--fuera'
              }
            >
              <Icono nombre="corazon" tamano={18} />
              <strong>{paciente.signosVitales?.ritmoCardiaco ?? '—'}</strong>
              <span>lpm</span>
            </div>
            <div
              className={
                signoEnRango('spo2', paciente.signosVitales?.spo2)
                  ? 'ficha__vital'
                  : 'ficha__vital ficha__vital--fuera'
              }
            >
              <Icono nombre="gota" tamano={18} />
              <strong>{paciente.signosVitales?.spo2 ?? '—'}</strong>
              <span>% SpO₂</span>
            </div>
            <div
              className={
                signoEnRango('temperatura', paciente.signosVitales?.temperatura)
                  ? 'ficha__vital'
                  : 'ficha__vital ficha__vital--fuera'
              }
            >
              <Icono nombre="temperatura" tamano={18} />
              <strong>{paciente.signosVitales?.temperatura ?? '—'}</strong>
              <span>°C</span>
            </div>
          </div>
          <div className="ficha__soportes">
            <span
              className={
                paciente.estadoCanula
                  ? 'badge badge--info'
                  : 'badge badge--neutro'
              }
            >
              Cánula {paciente.estadoCanula ? 'activa' : 'inactiva'}
            </span>
            <span
              className={
                paciente.viaIntravenosa
                  ? 'badge badge--info'
                  : 'badge badge--neutro'
              }
            >
              Vía IV {paciente.viaIntravenosa ? 'activa' : 'inactiva'}
            </span>
          </div>
        </section>
      </div>

      <section className="tarjeta">
        <header className="tarjeta__cabecera">
          <h2 className="tarjeta__titulo">Diagnóstico y observaciones</h2>
        </header>
        <div className="tarjeta__cuerpo ficha__textos">
          <div>
            <h3>Diagnóstico de ingreso</h3>
            <p>{paciente.diagnostico || 'Sin diagnóstico registrado.'}</p>
          </div>
          <div>
            <h3>Plan de cuidados</h3>
            <p>{paciente.planCuidados || 'Sin plan registrado.'}</p>
          </div>
          <div>
            <h3>Observaciones</h3>
            <p>{paciente.observaciones || 'Sin observaciones.'}</p>
          </div>
        </div>
      </section>

      <div className="ficha__rejilla ficha__rejilla--inferior">
        <section className="tarjeta tarjeta--sin-relleno">
          <header className="tarjeta__cabecera">
            <div>
              <h2 className="tarjeta__titulo">Prescripciones</h2>
              <p className="tarjeta__subtitulo">
                {paciente.medicamentos.length} medicamentos registrados
              </p>
            </div>
            <Link
              to="/medicamentos"
              className="boton boton--fantasma boton--sm"
            >
              Gestionar
            </Link>
          </header>
          <Table
            columns={columnasMedicamentos}
            data={paciente.medicamentos}
            rowKey={(fila) => fila.id}
            vacio="Sin prescripciones para este paciente."
            etiqueta="Prescripciones del paciente"
          />
        </section>

        <section className="tarjeta">
          <header className="tarjeta__cabecera">
            <div>
              <h2 className="tarjeta__titulo">Planes de cuidado</h2>
              <p className="tarjeta__subtitulo">{planes.length} registrados</p>
            </div>
            <Link to="/planes" className="boton boton--fantasma boton--sm">
              Ver todos
            </Link>
          </header>
          <div className="tarjeta__cuerpo ficha__planes">
            {planes.length === 0 ? (
              <p className="texto-muted texto-pequeno">
                Sin planes de cuidado registrados.
              </p>
            ) : (
              planes.slice(0, 4).map((plan) => (
                <article key={plan.id} className="ficha__plan">
                  <div>
                    <p className="ficha__fuerte">{plan.areaCuidado}</p>
                    <p className="ficha__secundario">{plan.intervencion}</p>
                    <p className="ficha__secundario">
                      Frecuencia: {plan.frecuencia}
                    </p>
                  </div>
                  <Badge
                    tono={
                      plan.estado === 'Activo'
                        ? 'exito'
                        : plan.estado === 'Suspendido'
                          ? 'aviso'
                          : 'neutro'
                    }
                  >
                    {plan.estado}
                  </Badge>
                </article>
              ))
            )}
          </div>
        </section>
      </div>

      <section className="tarjeta">
        <header className="tarjeta__cabecera">
          <div>
            <h2 className="tarjeta__titulo">Historial de alertas</h2>
            <p className="tarjeta__subtitulo">
              {paciente.alertas.length} eventos registrados
            </p>
          </div>
          <Link to="/alertas" className="boton boton--fantasma boton--sm">
            Ver alertas
          </Link>
        </header>
        <div className="tarjeta__cuerpo ficha__alertas">
          {paciente.alertas.length === 0 ? (
            <p className="texto-muted texto-pequeno">
              El paciente no registra alertas.
            </p>
          ) : (
            paciente.alertas.slice(0, 6).map((alerta) => (
              <article key={alerta.id} className="ficha__alerta">
                <span
                  className={`punto ${
                    alerta.nivel === 'Critica'
                      ? 'punto--critico'
                      : 'punto--aviso'
                  }`}
                  aria-hidden="true"
                />
                <div>
                  <p className="ficha__fuerte">{alerta.mensaje}</p>
                  <p className="ficha__secundario">
                    {alerta.tipoDisplay} ·{' '}
                    {formatearFechaHora(alerta.fechaHora)}
                  </p>
                </div>
                <Badge tono={alerta.nivel === 'Critica' ? 'critico' : 'aviso'}>
                  {alerta.nivelDisplay}
                </Badge>
              </article>
            ))
          )}
        </div>
      </section>

      <Modal
        abierto={altaAbierta}
        titulo={`Dar de alta a ${paciente.nombreCompleto}`}
        descripcion="El paciente quedará inactivo y su cuna será liberada."
        onCerrar={() => {
          if (!procesando) setAltaAbierta(false);
        }}
        ancho="sm"
        pie={
          <>
            <Button
              variante="secundario"
              onClick={() => setAltaAbierta(false)}
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
          <label className="campo__label" htmlFor="motivo-alta-ficha">
            Motivo del alta *
          </label>
          <textarea
            id="motivo-alta-ficha"
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
