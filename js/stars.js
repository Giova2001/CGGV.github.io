// Generación dinámica de estrellas
const starsContainer = document.getElementById("stars");

function createStar() {
  const star = document.createElement("div");
  star.classList.add("star");

  const size = Math.random() * 3 + 1 + "px";
  star.style.width = size;
  star.style.height = size;

  const left = Math.random() * 100 + "vw";
  star.style.left = left;

  const duration = Math.random() * 3 + 2 + "s";
  star.style.animationDuration = duration;

  starsContainer.appendChild(star);

  setTimeout(() => {
    star.remove();
  }, parseFloat(duration) * 1000);
}

setInterval(createStar, 100);
