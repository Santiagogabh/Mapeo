import 'leaflet/dist/leaflet.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './input.css';

// Función para renderizar en un contenedor específico
const renderApp = (containerIdOrElement) => {
  let container;
  
  if (typeof containerIdOrElement === 'string') {
    container = document.getElementById(containerIdOrElement);
  } else {
    container = containerIdOrElement;
  }
  
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

// Asegurar que window.MapeoApp está disponible ANTES de cualquier otra cosa
if (!window.MapeoApp) {
  window.MapeoApp = renderApp;
}

console.log('✓ window.MapeoApp disponible:', typeof window.MapeoApp);

// Para desarrollo local
setTimeout(() => {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    renderApp('root');
  }
}, 0);