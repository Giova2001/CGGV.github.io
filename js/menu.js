// menu.js
export function initMenu() {
  const menuToggle = document.getElementById("menuToggle");
  const menuSlideout = document.getElementById("menuSlideout");

  const closeButton = document.getElementById("closeMenuBtn");
  if (closeButton) {
    closeButton.addEventListener("click", () => {
      menuSlideout.classList.remove("active");
    });
  }

  if (!menuToggle || !menuSlideout) return;

  menuToggle.addEventListener("click", () => {
    menuSlideout.classList.toggle("active");
  });

  // Cerrar menú al hacer clic en enlaces
  const links = menuSlideout.querySelectorAll('a[data-target]');
  links.forEach(link => {
    link.addEventListener('click', () => {
      menuSlideout.classList.remove("active");
    });
  });
}

export function closeMenu() {
  const menuSlideout = document.getElementById("menuSlideout");
  if (menuSlideout) {
    menuSlideout.classList.remove('active');
  }
}