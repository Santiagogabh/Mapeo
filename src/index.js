import 'leaflet/dist/leaflet.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './input.css';

// Función para renderizar en un contenedor específico
const renderApp = (containerIdOrElement) => {
  console.log('renderApp llamada con:', containerIdOrElement);
  
  let container;
  
  if (typeof containerIdOrElement === 'string') {
    container = document.getElementById(containerIdOrElement);
  } else {
    container = containerIdOrElement;
  }
  
  console.log('container encontrado:', container);
  
  if (!container) {
    console.error('Contenedor no válido:', containerIdOrElement);
    return;
  }

  try {
    const root = ReactDOM.createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log('✓ App renderizada correctamente');
  } catch (error) {
    console.error('✗ Error al renderizar:', error);
  }
};

// IMPORTANTE: Asignar a window INMEDIATAMENTE y de forma global
window.MapeoApp = renderApp;
window.mapeoApp = renderApp;

console.log('✓ window.MapeoApp asignado:', typeof window.MapeoApp);
console.log('✓ window.mapeoApp asignado:', typeof window.mapeoApp);

// Para desarrollo local
const rootElement = document.getElementById('root');
if (rootElement) {
  renderApp('root');
}