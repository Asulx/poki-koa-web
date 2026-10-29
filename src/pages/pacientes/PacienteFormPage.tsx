/**
 * @file PacienteFormPage.tsx
 * @description Página compartida para registrar y editar pacientes. El modo
 * se deduce de la presencia del parámetro `id` en la ruta.
 */

import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { obtenerMensajeError } from '@/api/axios';
import PacienteForm from '@/components/pacientes/PacienteForm';
import Icono from '@/components/ui/Iconos/Iconos';
import Spinner from '@/components/ui/Spinner/Spinner';
import { useToast } from '@/context/ToastContext';
import { medicosService } from '@/services/medicosService';
import { pacientesService } from '@/services/pacientesService';
import type { Medico } from '@/types/medico';
import type { Paciente, PacientePayload } from '@/types/paciente';

/**
 * Página de alta o edición de paciente.
 *
 * @returns Formulario clínico cargado con los datos necesarios.
 */
export default function PacienteFormPage() {
  const { id } = useParams<{ id: string }>();
  const navegar = useNavigate();
  const { exito, error: notificarError } = useToast();

  const modoEdicion = Boolean(id);
  const [paciente, setPaciente] = useState<Paciente | undefined>(undefined);
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [cargando, setCargando] = useState(modoEdicion);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let vigente = true;

    const cargar = async () => {
      setCargando(true);
      setError('');

      try {
        const [listaMedicos, datosPaciente] = await Promise.all([
          medicosService.listar(),
          modoEdicion && id
            ? pacientesService.obtener(Number(id))
            : Promise.resolve(undefined),
        ]);

        if (!vigente) return;
        setMedicos(listaMedicos);
        if (datosPaciente) setPaciente(datosPaciente);
      } catch (fallo) {
        if (vigente) setError(obtenerMensajeError(fallo));
      } finally {
        if (vigente) setCargando(false);
      }
    };

    void cargar();
    return () => {
      vigente = false;
    };
  }, [id, modoEdicion]);

  /**
   * Persiste el paciente y redirige a su ficha.
   *
   * @param datos - Payload validado por el formulario.
   */
  const guardar = async (datos: PacientePayload) => {
    setGuardando(true);
    setError('');

    try {
      const resultado =
        modoEdicion && id
          ? await pacientesService.actualizar(Number(id), datos)
          : await pacientesService.crear(datos);

      exito(
        modoEdicion
          ? 'Los datos del paciente se actualizaron.'
          : 'Paciente registrado correctamente.'
      );
      navegar(`/pacientes/${resultado.id}`, { replace: true });
    } catch (fallo) {
      const mensaje = obtenerMensajeError(fallo);
      setError(mensaje);
      notificarError(mensaje);
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return <Spinner bloque texto="Cargando datos del paciente…" />;
  }

  return (
    <div className="pagina">
      <header className="pagina__cabecera">
        <div>
          <Link to="/pacientes" className="pagina__volver">
            <Icono nombre="volver" tamano={14} />
            Volver al listado
          </Link>
          <h2 className="pagina__titulo">
            {modoEdicion ? 'Editar paciente' : 'Nuevo paciente'}
          </h2>
          <p className="pagina__descripcion">
            {modoEdicion
              ? 'Actualiza la información clínica y administrativa del recién nacido.'
              : 'Registra el ingreso de un recién nacido a la unidad neonatal.'}
          </p>
        </div>
      </header>

      {modoEdicion && !paciente && error ? (
        <div className="mensaje mensaje--error" role="alert">
          <span aria-hidden="true">!</span>
          <span>{error}</span>
        </div>
      ) : (
        <PacienteForm
          paciente={paciente}
          medicos={medicos}
          guardando={guardando}
          error={error}
          onSubmit={guardar}
          onCancelar={() =>
            navegar(modoEdicion && id ? `/pacientes/${id}` : '/pacientes')
          }
        />
      )}
    </div>
  );
}
