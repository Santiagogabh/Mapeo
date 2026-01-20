import 'leaflet/dist/leaflet.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './input.css';

console.log('📦 index.js cargado');

const rootInstances = new WeakMap();

function renderMapeoApp(container) {
  console.log('renderMapeoApp llamada para:', container);
  
  if (!container || !(container instanceof HTMLElement)) {
    console.error('❌ Container inválido:', container);
    return false;
  }

  if (rootInstances.has(container)) {
    console.warn('⚠️ Este contenedor ya tiene un root');
    return true;
  }

  if (container.hasAttribute('data-mapeo-initialized')) {
    console.warn('⚠️ Ya inicializado');
    return true;
  }

  try {
    console.log('✨ Creando root de React...');
    const root = ReactDOM.createRoot(container);
    rootInstances.set(container, root);
    
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    container.setAttribute('data-mapeo-initialized', 'true');
    console.log('✅ App renderizada correctamente');
    return true;
  } catch (error) {
    console.error('❌ Error al renderizar:', error);
    container.innerHTML = `
      <div style="padding:20px;background:#fee;border:1px solid #c00;border-radius:4px;margin:10px 0;">
        <strong>⚠️ Error al cargar Mapeo:</strong><br>
        <code>${error.message}</code>
      </div>
    `;
    return false;
  }
}

// 🔧 Para desarrollo local (opcional)
if (process.env.NODE_ENV === 'development') {
  const initDev = () => {
    const devRoot = document.getElementById('root');
    if (devRoot && !devRoot.hasAttribute('data-mapeo-initialized')) {
      console.log('🔧 Modo desarrollo: renderizando en #root');
      renderMapeoApp(devRoot);
    }
  };
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDev);
  } else {
    initDev();
  }
}

// ⚠️ IMPORTANTE: webpack expondrá esto como window.MapeoApp
export default renderMapeoApp;