import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '60vh', 
      textAlign: 'center', 
      padding: '2rem' 
    }}>
      <h1 style={{ fontSize: '5rem', color: 'var(--accent)', margin: '0 0 1rem 0' }}>404</h1>
      <h2>Página no encontrada</h2>
      <p style={{ margin: '1rem 0 2rem 0', color: 'var(--text)', maxWidth: '400px' }}>
        La ruta o sección a la que intentas acceder en el sistema Poki Koa no existe o fue movida.
      </p>
      <Link 
        to="/" 
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: 'var(--accent)',
          color: '#ffffff',
          borderRadius: '6px',
          textDecoration: 'none',
          fontWeight: 600,
          display: 'inline-block'
        }}
      >
        Volver al Inicio
      </Link>
    </div>
  );
};