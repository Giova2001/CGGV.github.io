// Alternar tema claro/oscuro
const themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-theme");
  themeToggle.textContent = document.body.classList.contains("light-theme")
    ? "Dark Mode"
    : "Light Mode";
});

// Generación dinámica de estrellas
const starsContainer = document.getElementById("stars");

function createStar() {
  const star = document.createElement("div");
  star.classList.add("star");

  // Tamaño aleatorio
  const size = Math.random() * 3 + 1 + "px";
  star.style.width = size;
  star.style.height = size;

  // Posición aleatoria
  const left = Math.random() * 100 + "vw";
  star.style.left = left;

  // Duración aleatoria
  const duration = Math.random() * 3 + 2 + "s";
  star.style.animationDuration = duration;

  // Añadir la estrella al contenedor
  starsContainer.appendChild(star);

  // Eliminar la estrella cuando termine la animación
  setTimeout(() => {
    star.remove();
  }, parseFloat(duration) * 1000);
}

// Crear estrellas continuamente
setInterval(createStar, 100);

// Menú deslizante
const menuToggle = document.getElementById("menuToggle");
const menuSlideout = document.getElementById("menuSlideout");

// Alternar el menú
menuToggle.addEventListener("click", () => {
  menuSlideout.classList.toggle("active");
});
