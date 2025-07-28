import { initContactPage, setupEmailForm } from './contact.js'; // <--- Agrega setupEmailForm
import { closeMenu } from './menu.js';

export function setupContentLoading() {
  const mainContent = document.getElementById('main-content');
  if (!mainContent) return;

  // Cargar home por defecto
  loadContent('home.html');

  // Enlazar eventos a links iniciales
  setupDynamicLinks();
}

function setupDynamicLinks() {
  const links = document.querySelectorAll('a[data-target]');
  links.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const target = this.getAttribute('data-target');
      if (target) {
        loadContent(target);
        closeMenu();
      }
    });
  });
}

async function loadContent(url) {
  const mainContent = document.getElementById('main-content');
  mainContent.innerHTML = `<div class="loading">Cargando...</div>`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Contenido no encontrado");

    const html = await response.text();
    mainContent.innerHTML = html;

    setupDynamicLinks(); // re-enlazar nuevos links

    // Inicializar scripts específicos
    if (url === 'contact.html') {
      initContactPage();
      setupEmailForm(); // <--- ESTO FALTABA
    }

  } catch (error) {
    mainContent.innerHTML = `<p class="error">Error al cargar contenido: ${error.message}</p>`;
    console.error(error);
  }
}