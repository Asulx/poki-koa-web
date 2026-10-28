import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '@/components/ui/Button/Button';
import { useAuth } from '@/context/AuthContext';

/**
 * Componente de página para el inicio de sesión (*Login*).
 * Gestiona la autenticación del usuario mediante credenciales, el estado de carga,
 * el manejo de errores y la redirección automática al panel principal tras un acceso exitoso.
 *
 * @returns Un elemento JSX con el formulario y la lógica de autenticación.
 */
export default function LoginPage() {
  const { iniciarSesion } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      // Ejecutamos la función simulada que configuramos en AuthContext
      await iniciarSesion(username, password);

      // Pasamos directo a la ruta principal
      navigate('/');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'No se pudo iniciar sesión'
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <form onSubmit={enviar} style={{ maxWidth: 320, margin: '80px auto' }}>
      <h1>Poki Koa</h1>

      <div>
        <label>Usuario</label>
        <input value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>

      <div>
        <label>Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button type="submit" disabled={cargando || !username || !password}>
        {cargando ? 'Ingresando...' : 'Ingresar'}
      </button>
    </form>
  );
}
