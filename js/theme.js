// Alternar tema claro/oscuro
const themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-theme");
  themeToggle.textContent = document.body.classList.contains("light-theme")
    ? "Dark Mode"
    : "Light Mode";
});
