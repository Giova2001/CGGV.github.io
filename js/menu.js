// menu.js
let menuInitialized = false;
let escapeHandler = null;

export function initMenu() {
  // Prevenir múltiples inicializaciones
  if (menuInitialized) {
    console.log("Menú ya inicializado, saltando...");
    return;
  }

  console.log("Inicializando menú...");
  
  const menuToggle = document.getElementById("menuToggle");
  const menuSlideout = document.getElementById("menuSlideout");

  if (!menuToggle) {
    console.error("Botón menuToggle no encontrado");
    return;
  }

  if (!menuSlideout) {
    console.error("menuSlideout no encontrado");
    return;
  }

  console.log("Elementos del menú encontrados");

  const closeButton = document.getElementById("closeMenuBtn");
  if (closeButton) {
    // Usar una función nombrada para poder remover el listener si es necesario
    const closeButtonHandler = () => {
      console.log("Cerrando menú desde botón X");
      closeMenu();
    };
    closeButton.addEventListener("click", closeButtonHandler);
    
    // Cerrar con Escape (solo una vez, usando variable global)
    if (!escapeHandler) {
      escapeHandler = (e) => {
        if (e.key === "Escape" && menuSlideout.classList.contains("active")) {
          console.log("Cerrando menú con Escape");
          closeMenu();
        }
      };
      document.addEventListener("keydown", escapeHandler);
    }
  }

  // Evento principal del botón de menú (usar función nombrada)
  const menuToggleHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log("Click en botón de menú");
    const isActive = menuSlideout.classList.contains("active");
    
    if (isActive) {
      console.log("Cerrando menú");
      menuSlideout.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.height = "";
    } else {
      console.log("Abriendo menú");
      menuSlideout.classList.add("active");
      menuToggle.setAttribute("aria-expanded", "true");
      document.body.classList.add("menu-open");
      // Usar clase CSS en lugar de estilo inline para mejor compatibilidad
      document.body.style.overflow = "hidden";
    }
  };
  menuToggle.addEventListener("click", menuToggleHandler);

  // Cerrar menú al hacer clic en enlaces
  const links = menuSlideout.querySelectorAll('a[data-target]');
  console.log(`Encontrados ${links.length} enlaces en el menú`);
  links.forEach(link => {
    const linkHandler = () => {
      console.log("Cerrando menú desde enlace");
      closeMenu();
    };
    link.addEventListener('click', linkHandler);
  });
  
  // Cerrar al hacer clic fuera del menú (usar función nombrada)
  const menuSlideoutHandler = (e) => {
    if (e.target === menuSlideout) {
      console.log("Cerrando menú al hacer clic fuera");
      closeMenu();
    }
  };
  menuSlideout.addEventListener("click", menuSlideoutHandler);

  // Marcar como inicializado
  menuInitialized = true;
  console.log("Menú inicializado correctamente");
}

export function closeMenu() {
  const menuSlideout = document.getElementById("menuSlideout");
  const menuToggle = document.getElementById("menuToggle");
  
  if (menuSlideout) {
    menuSlideout.classList.remove('active');
    document.body.classList.remove("menu-open");
    document.body.style.overflow = "";
    document.body.style.position = "";
    document.body.style.width = "";
    document.body.style.height = "";
    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", "false");
    }
  }
}