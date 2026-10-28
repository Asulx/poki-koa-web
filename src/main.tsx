/**
 * @file main.tsx
 * @description Punto de entrada principal de la aplicación React. Inicializa el DOM,
 * importa las hojas de estilos globales y monta el componente raíz dentro de StrictMode.
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

import '@/styles/variables.css';
import '@/styles/typography.css';
import '@/styles/breakpoints.css';
import '@/styles/globals.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);