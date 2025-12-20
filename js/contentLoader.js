import { initContactPage, setupEmailForm } from './contact.js';
import { closeMenu } from './menu.js';

export function setupContentLoading() {
  const mainContent = document.getElementById('main-content');
  if (!mainContent) {
    console.error(" Elemento main-content no encontrado");
    return;
  }

  // Cargar home por defecto
  console.log("Cargando home.html...");
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
  if (!mainContent) {
    console.error(" main-content no encontrado en loadContent");
    return;
  }
  
  console.log(` Cargando contenido: ${url}`);
  mainContent.innerHTML = `<div class="loading" role="status" aria-live="polite">Cargando...</div>`;
  mainContent.setAttribute("aria-busy", "true");

  try {
    // Usar ruta relativa desde la raíz del proyecto
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'text/html'
      }
    });
    
    console.log(`Respuesta fetch:`, response.status, response.statusText);
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();
    console.log(` Contenido cargado, longitud: ${html.length} caracteres`);
    
    if (!html || html.trim().length === 0) {
      throw new Error("El archivo está vacío");
    }
    
    mainContent.innerHTML = html;
    mainContent.removeAttribute("aria-busy");

    setupDynamicLinks(); // re-enlazar nuevos links

    // Inicializar scripts específicos
    if (url === 'contact.html') {
      initContactPage();
      setupEmailForm();
    }

    if (url === "chatbot.html") {
      try {
        const chatbotModule = await import('./chatbot.js');
        chatbotModule.initChatBot();
      } catch (err) {
        console.error("Error cargando chatbot.js:", err);
        mainContent.innerHTML += `<p class="error">Error al cargar el chatbot: ${err.message}</p>`;
      }
    }

    // Inicializar carrusel de certificados cuando se carga home.html
    if (url === 'home.html') {
      try {
        const certificatesModule = await import('./certificates.js');
        certificatesModule.initCertificatesCarousel();
      } catch (err) {
        console.error("Error cargando certificates.js:", err);
      }
    }

    // Inicializar proyectos cuando se carga projects.html
    if (url === 'projects.html') {
      try {
        const projectsModule = await import('./projects.js');
        projectsModule.initProjects();
      } catch (err) {
        console.error("Error cargando projects.js:", err);
      }
    }

    // Actualizar título de la página para accesibilidad
    const pageTitle = mainContent.querySelector('h1');
    if (pageTitle) {
      document.title = `${pageTitle.textContent} - Portafolio`;
    }

  } catch (error) {
    mainContent.innerHTML = `
      <div class="error" role="alert">
        <h2>Error al cargar contenido</h2>
        <p>${error.message}</p>
        <button onclick="location.reload()" class="button">Recargar página</button>
      </div>
    `;
    mainContent.removeAttribute("aria-busy");
    console.error("Error cargando contenido:", error);
  }
}