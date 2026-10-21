import React, { useState } from 'react';
import './Login.css';

export default function Login() {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');

  // Estructura de datos para renderizar la lista dinámicamente
  const demoUsers = [
    { id: 1, init: 'AL', name: 'Dra. Ana López', role: 'Médico Neonatólogo', tag: 'ADMIN' },
    { id: 2, init: 'CR', name: 'Dr. Carlos Ramírez', role: 'Neonatólogo', tag: 'ADMIN' },
    { id: 3, init: 'RP', name: 'Enf. Rosa Pérez', role: 'Enfermera Jefe', tag: 'ENFERMERÍA' },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault(); // Evita que la página se recargue al enviar el formulario
    console.log("Autenticando:", usuario, password);
  };

  return (
    <div className="login-wrapper">
      <header className="login-header">
        <div className="logo-circle">
          {/* Reemplaza este emoji con el tag <img> cuando exportes el SVG de Figma */}
          <span className="logo-emoji">🗿👶</span>
        </div>
        <h1 className="title">Poki Koa</h1>
        <h2 className="subtitle">Sistema de Monitoreo Neonatal</h2>
      </header>

      <main className="glass-card">
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label>USUARIO</label>
            <input
              type="text"
              placeholder="ana.lopez"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
            />
          </div>

          <div className="input-group">
            <div className="label-row">
              <label>CONTRASEÑA</label>
              <a href="#" className="forgot-link">¿Olvidaste tu contraseña?</a>
            </div>
            <input
              type="password"
              placeholder="••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-primary">
            Ingresar al Sistema
          </button>
        </form>

        <section className="demo-section">
          <p className="demo-hint">PERSONAL CLÍNICO (DEMO - CONTRASEÑA: 1234)</p>
          <div className="user-list">
            {demoUsers.map((user) => (
              <div key={user.id} className="user-row">
                <div className="avatar">{user.init}</div>
                <div className="user-data">
                  <span className="user-name">{user.name}</span>
                  <span className="user-role">{user.role}</span>
                </div>
                <span className={`tag ${user.tag.toLowerCase()}`}>{user.tag}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      <button className="btn-help">?</button>
    </div>
  );
}