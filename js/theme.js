// Alternar tema claro/oscuro con persistencia
const THEME_KEY = 'portfolio-theme';

function initTheme() {
  const themeToggle = document.getElementById("themeToggle");
  if (!themeToggle) return;

  // Cargar tema guardado o usar preferencia del sistema
  const savedTheme = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const shouldUseLightTheme = savedTheme === 'light' || (!savedTheme && !prefersDark);
  
  if (shouldUseLightTheme) {
    document.body.classList.add("light-theme");
    themeToggle.textContent = "Modo oscuro";
  } else {
    document.body.classList.remove("light-theme");
    themeToggle.textContent = "Modo claro";
  }

  themeToggle.addEventListener("click", () => {
    const isLight = document.body.classList.contains("light-theme");
    
    if (isLight) {
      document.body.classList.remove("light-theme");
      themeToggle.textContent = "Modo claro";
      localStorage.setItem(THEME_KEY, 'dark');
    } else {
      document.body.classList.add("light-theme");
      themeToggle.textContent = "Modo oscuro";
      localStorage.setItem(THEME_KEY, 'light');
    }
    
    themeToggle.setAttribute("aria-label", `Cambiar a ${isLight ? 'modo oscuro' : 'modo claro'}`);
  });

  themeToggle.setAttribute("aria-label", "Alternar tema claro/oscuro");
  themeToggle.setAttribute("role", "button");
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTheme);
} else {
  initTheme();
}
