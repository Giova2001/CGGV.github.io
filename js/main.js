// main.js
import { initMenu } from './menu.js';
import { setupContentLoading } from './contentLoader.js';

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
  initMenu();
  setupContentLoading();
});