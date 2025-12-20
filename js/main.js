// main.js
import { initMenu } from './menu.js';
import { setupContentLoading } from './contentLoader.js';

// Inicializar la aplicación
console.log("Inicializando aplicación...");

function initApp() {
  try {
    console.log("Inicializando componentes...");
    initMenu();
    setupContentLoading();
    console.log("Aplicación inicializada correctamente");
  } catch (error) {
    console.error("Error al inicializar aplicación:", error);
    console.error(error.stack);
  }
}

// Esperar a que el DOM esté completamente listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM cargado, inicializando app...");
    initApp();
  });
} else {
  // DOM ya está listo, pero esperar un tick para asegurar que todo esté disponible
  console.log("DOM ya estaba listo, inicializando app...");
  setTimeout(initApp, 0);
}