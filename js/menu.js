// menu.js
export function initMenu() {
  console.log("🍔 Inicializando menú...");
  
  const menuToggle = document.getElementById("menuToggle");
  const menuSlideout = document.getElementById("menuSlideout");

  if (!menuToggle) {
    console.error("❌ Botón menuToggle no encontrado");
    return;
  }

  if (!menuSlideout) {
    console.error("❌ menuSlideout no encontrado");
    return;
  }

  console.log("✅ Elementos del menú encontrados");

  const closeButton = document.getElementById("closeMenuBtn");
  if (closeButton) {
    closeButton.addEventListener("click", () => {
      console.log("🔒 Cerrando menú desde botón X");
      closeMenu();
    });
    
    // Cerrar con Escape (solo una vez)
    let escapeHandlerAdded = false;
    if (!escapeHandlerAdded) {
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && menuSlideout.classList.contains("active")) {
          console.log("🔒 Cerrando menú con Escape");
          closeMenu();
        }
      });
      escapeHandlerAdded = true;
    }
  }

  // Evento principal del botón de menú
  menuToggle.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log("🍔 Click en botón de menú");
    const isActive = menuSlideout.classList.contains("active");
    
    if (isActive) {
      console.log("🔒 Cerrando menú");
      menuSlideout.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    } else {
      console.log("🔓 Abriendo menú");
      menuSlideout.classList.add("active");
      menuToggle.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    }
  });

  // Cerrar menú al hacer clic en enlaces
  const links = menuSlideout.querySelectorAll('a[data-target]');
  console.log(`🔗 Encontrados ${links.length} enlaces en el menú`);
  links.forEach(link => {
    link.addEventListener('click', () => {
      console.log("🔒 Cerrando menú desde enlace");
      closeMenu();
    });
  });
  
  // Cerrar al hacer clic fuera del menú
  menuSlideout.addEventListener("click", (e) => {
    if (e.target === menuSlideout) {
      console.log("🔒 Cerrando menú al hacer clic fuera");
      closeMenu();
    }
  });

  console.log("✅ Menú inicializado correctamente");
}

export function closeMenu() {
  const menuSlideout = document.getElementById("menuSlideout");
  const menuToggle = document.getElementById("menuToggle");
  
  if (menuSlideout) {
    menuSlideout.classList.remove('active');
    document.body.style.overflow = "";
    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", "false");
    }
  }
}