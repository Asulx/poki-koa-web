/**
 * @file ConfiguracionPage.tsx
 * @description Configuración de la cuenta: identidad clínica, estado de la
 * sesión, permisos del rol e información del entorno de ejecución.
 */

import { useState } from 'react';

import { API_URL } from '@/api/axios';
import Badge from '@/components/ui/Badge/Badge';
import Button from '@/components/ui/Button/Button';
import Icono from '@/components/ui/Iconos/Iconos';
import Modal from '@/components/ui/Modal/Modal';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import {
  etiquetaRol,
  nombreVisible,
  puedeGestionarClinica,
  puedeVerAuditoria,
} from '@/utils/roles';

import './ConfiguracionPage.css';

/**
 * Enmascara un token para mostrarlo sin exponerlo completo.
 *
 * @param token - Token de sesión.
 * @returns Representación parcial o `—` si no existe.
 */
function enmascararToken(token: string | null): string {
  if (!token) return '—';
  if (token.length <= 12) return '••••••';
  return `${token.slice(0, 6)}••••••${token.slice(-4)}`;
}

/**
 * Página de configuración de la cuenta.
 *
 * @returns Datos del perfil, sesión, permisos y entorno.
 */
export default function ConfiguracionPage() {
  const { usuario, perfil, token, recargarSesion, cerrarSesion } = useAuth();
  const { exito, error: notificarError } = useToast();

  const [recargando, setRecargando] = useState(false);
  const [confirmandoSalida, setConfirmandoSalida] = useState(false);
  const [saliendo, setSaliendo] = useState(false);

  const nombre = nombreVisible(usuario, perfil);
  const rol = perfil?.rol ?? usuario?.rol ?? null;
  const iniciales =
    perfil?.iniciales?.trim() || usuario?.iniciales?.trim() || 'PK';

  /**
   * Refresca usuario y perfil desde `/auth/me/`.
   */
  const actualizarSesion = async () => {
    setRecargando(true);
    try {
      const actualizada = await recargarSesion();
      if (actualizada) {
        exito('Datos de la sesión actualizados.');
      } else {
        notificarError(
          'Tu sesión ya no es válida. Vuelve a iniciar sesión para continuar.'
        );
      }
    } finally {
      setRecargando(false);
    }
  };

  /**
   * Cierra la sesión y deja que el guardián redirija al login.
   */
  const salir = async () => {
    setSaliendo(true);
    try {
      await cerrarSesion();
      setConfirmandoSalida(false);
    } finally {
      setSaliendo(false);
    }
  };

  const zonaHoraria =
    Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Lima';

  return (
    <div className="pagina configuracion">
      <header className="pagina__cabecera">
        <div>
          <h2 className="pagina__titulo">Configuración</h2>
          <p className="pagina__descripcion">
            Identidad clínica, seguridad de la sesión y alcance de tu rol en
            Poki Koa.
          </p>
        </div>
      </header>

      <div className="configuracion__rejilla">
        <section className="tarjeta configuracion__perfil">
          <div className="configuracion__identidad">
            <span className="configuracion__avatar" aria-hidden="true">
              {iniciales}
            </span>
            <div>
              <h3 className="configuracion__nombre">{nombre}</h3>
              <p className="configuracion__rol">
                <Badge tono={rol ? 'info' : 'neutro'} punto>
                  {etiquetaRol(rol)}
                </Badge>
                {perfil?.turno && (
                  <span className="chip">
                    <Icono nombre="reloj" tamano={12} />
                    {perfil.turno}
                  </span>
                )}
              </p>
            </div>
          </div>

          <dl className="configuracion__datos">
            <div>
              <dt>Usuario</dt>
              <dd className="texto-mono">{usuario?.username ?? '—'}</dd>
            </div>
            <div>
              <dt>Correo institucional</dt>
              <dd>{usuario?.email || 'No registrado'}</dd>
            </div>
            <div>
              <dt>Nombre de perfil</dt>
              <dd>{perfil?.nombreCompleto || '—'}</dd>
            </div>
            <div>
              <dt>Estado de la cuenta</dt>
              <dd>
                <Badge tono={usuario?.activo ? 'exito' : 'critico'} punto>
                  {usuario?.activo ? 'Activa' : 'Inactiva'}
                </Badge>
              </dd>
            </div>
            <div>
              <dt>Alta en el sistema</dt>
              <dd>
                {perfil?.creadoEn
                  ? new Date(perfil.creadoEn).toLocaleDateString('es-PE')
                  : '—'}
              </dd>
            </div>
            <div>
              <dt>Última actualización</dt>
              <dd>
                {perfil?.actualizadoEn
                  ? new Date(perfil.actualizadoEn).toLocaleString('es-PE')
                  : '—'}
              </dd>
            </div>
          </dl>
        </section>

        <section className="tarjeta configuracion__sesion">
          <header className="tarjeta__cabecera">
            <div>
              <h2 className="tarjeta__titulo">Sesión y seguridad</h2>
              <p className="tarjeta__subtitulo">
                Token personal emitido por el servidor clínico.
              </p>
            </div>
            <Icono nombre="escudo" tamano={20} />
          </header>

          <div className="tarjeta__cuerpo configuracion__sesion-cuerpo">
            <div className="configuracion__token">
              <span className="configuracion__token-etiqueta">
                Token activo
              </span>
              <code className="configuracion__token-valor">
                {enmascararToken(token)}
              </code>
            </div>

            <p className="configuracion__nota">
              <Icono nombre="candado" tamano={14} />
              El token se guarda en este navegador y se envía en cada petición.
              Ciérralo al terminar tu jornada si compartes el equipo.
            </p>

            <div className="configuracion__acciones">
              <Button
                variante="secundario"
                onClick={() => void actualizarSesion()}
                cargando={recargando}
              >
                Actualizar datos
              </Button>
              <Button
                variante="peligro"
                onClick={() => setConfirmandoSalida(true)}
                icono={<Icono nombre="salir" tamano={15} />}
              >
                Cerrar sesión
              </Button>
            </div>
          </div>
        </section>
      </div>

      <div className="configuracion__rejilla">
        <section className="tarjeta">
          <header className="tarjeta__cabecera">
            <div>
              <h2 className="tarjeta__titulo">Alcance de tu rol</h2>
              <p className="tarjeta__subtitulo">
                Permisos efectivos de {etiquetaRol(rol)} en esta instalación.
              </p>
            </div>
            <Icono nombre="usuario" tamano={19} />
          </header>

          <div className="tarjeta__cuerpo">
            <ul className="configuracion__permisos">
              <li>
                <Icono nombre="check" tamano={15} />
                Consultar panel, mapa de cunas, pacientes, medicamentos, planes,
                alertas, turnos y reportes.
              </li>
              <li
                className={
                  puedeGestionarClinica(usuario)
                    ? ''
                    : 'configuracion__permiso--no'
                }
              >
                <Icono
                  nombre={puedeGestionarClinica(usuario) ? 'check' : 'cerrar'}
                  tamano={15}
                />
                Registrar y editar pacientes, cunas, prescripciones y planes de
                cuidado.
              </li>
              <li
                className={
                  puedeVerAuditoria(usuario) ? '' : 'configuracion__permiso--no'
                }
              >
                <Icono
                  nombre={puedeVerAuditoria(usuario) ? 'check' : 'cerrar'}
                  tamano={15}
                />
                Administrar el personal y revisar la bitácora de auditoría.
              </li>
            </ul>

            <p className="configuracion__nota">
              <Icono nombre="escudo" tamano={14} />
              El servidor es la autoridad final: si una acción no está permitida
              para tu rol, la API la rechazará aunque la interfaz la muestre.
            </p>
          </div>
        </section>

        <section className="tarjeta">
          <header className="tarjeta__cabecera">
            <div>
              <h2 className="tarjeta__titulo">Entorno</h2>
              <p className="tarjeta__subtitulo">
                Datos técnicos de la instalación.
              </p>
            </div>
            <Icono nombre="configuracion" tamano={19} />
          </header>

          <div className="tarjeta__cuerpo">
            <dl className="configuracion__datos configuracion__datos--entorno">
              <div>
                <dt>API</dt>
                <dd className="texto-mono">{API_URL}</dd>
              </div>
              <div>
                <dt>Zona horaria del navegador</dt>
                <dd className="texto-mono">{zonaHoraria}</dd>
              </div>
              <div>
                <dt>Zona horaria institucional</dt>
                <dd className="texto-mono">America/Lima</dd>
              </div>
              <div>
                <dt>Versión</dt>
                <dd>Poki Koa UI · 1.0.0</dd>
              </div>
            </dl>
          </div>
        </section>
      </div>

      <Modal
        abierto={confirmandoSalida}
        titulo="Cerrar sesión"
        descripcion="Se invalidará el token en el servidor y volverás a la pantalla de acceso."
        ancho="sm"
        onCerrar={() => {
          if (!saliendo) setConfirmandoSalida(false);
        }}
        pie={
          <>
            <Button
              variante="secundario"
              onClick={() => setConfirmandoSalida(false)}
              disabled={saliendo}
            >
              Cancelar
            </Button>
            <Button
              variante="peligro"
              onClick={() => void salir()}
              cargando={saliendo}
            >
              Cerrar sesión
            </Button>
          </>
        }
      >
        <p className="configuracion__confirmacion">
          ¿Deseas salir de Poki Koa, <strong>{nombre}</strong>? Asegúrate de
          haber registrado tus pendientes del turno antes de continuar.
        </p>
      </Modal>
    </div>
  );
}
