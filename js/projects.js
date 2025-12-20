// projects.js - Efecto de puntero iluminado en tarjetas de proyectos

export function initProjects() {
  const cardsContainer = document.querySelector(".projects-main__cards");
  const cardsContainerInner = document.querySelector(".cards__inner");
  const overlay = document.querySelector(".overlay");
  
  // Seleccionar solo las tarjetas dentro de cards__inner (no las del overlay)
  const cards = Array.from(cardsContainerInner.querySelectorAll(".card"));

  if (!cardsContainer || !overlay || cards.length === 0) {
    console.warn("Elementos del proyecto no encontrados");
    return;
  }

  const applyOverlayMask = (e) => {
    const overlayEl = overlay;
    const rect = cardsContainer.getBoundingClientRect();
    const x = e.pageX - rect.left;
    const y = e.pageY - rect.top;

    overlayEl.style.setProperty("--opacity", "1");
    overlayEl.style.setProperty("--x", `${x}px`);
    overlayEl.style.setProperty("--y", `${y}px`);
    
    // Marcar que el overlay está activo para deshabilitar hover en CSS
    cardsContainer.setAttribute("data-overlay-active", "true");
  };
  
  const resetOverlay = () => {
    overlay.style.setProperty("--opacity", "0");
    // Quitar el atributo para restaurar el hover
    cardsContainer.removeAttribute("data-overlay-active");
  };

  const createOverlayCta = (overlayCard, ctaEl) => {
    const overlayCta = document.createElement("a");
    overlayCta.classList.add("cta");
    overlayCta.textContent = ctaEl.textContent.trim(); // Asegurar que no hay espacios extra
    overlayCta.href = ctaEl.href;
    overlayCta.setAttribute("aria-hidden", "true");
    overlayCta.setAttribute("tabindex", "-1");
    overlayCta.style.pointerEvents = 'none'; // Prevenir interacciones
    overlayCard.append(overlayCta);
  };

  const observer = new ResizeObserver((entries) => {
    entries.forEach((entry) => {
      const cardIndex = cards.indexOf(entry.target);
      const originalCard = entry.target;
      const overlayCard = overlay.children[cardIndex];
      
      if (cardIndex >= 0 && overlayCard) {
        const rect = originalCard.getBoundingClientRect();
        const containerRect = cardsContainer.getBoundingClientRect();
        
        // Sincronizar posición y tamaño exacto con precisión de subpíxel
        const left = rect.left - containerRect.left;
        const top = rect.top - containerRect.top;
        overlayCard.style.position = 'absolute';
        overlayCard.style.left = `${left}px`;
        overlayCard.style.top = `${top}px`;
        overlayCard.style.width = `${rect.width}px`;
        overlayCard.style.height = `${rect.height}px`;
        overlayCard.style.transform = 'none';
        overlayCard.style.margin = '0';
        
      }
    });
  });

  const initOverlayCard = (cardEl) => {
    const overlayCard = document.createElement("div");
    overlayCard.classList.add("card");
    
    // Copiar contenido de la tarjeta original
    const heading = cardEl.querySelector(".card__heading");
    const description = cardEl.querySelector(".card__description");
    const bullets = cardEl.querySelector(".card__bullets");
    const ctaEl = cardEl.querySelector(".card__cta");
    
    if (heading) {
      const overlayHeading = heading.cloneNode(true);
      overlayCard.appendChild(overlayHeading);
    }
    
    if (description) {
      const overlayDescription = description.cloneNode(true);
      overlayCard.appendChild(overlayDescription);
    }
    
    if (bullets) {
      const overlayBullets = bullets.cloneNode(true);
      overlayCard.appendChild(overlayBullets);
    }
    
    if (ctaEl) {
      createOverlayCta(overlayCard, ctaEl);
    }
    
    overlay.append(overlayCard);
    observer.observe(cardEl);
    
    // Sincronizar posición inicial después de que se agregue al DOM
    requestAnimationFrame(() => {
      const rect = cardEl.getBoundingClientRect();
      const containerRect = cardsContainer.getBoundingClientRect();
      overlayCard.style.position = 'absolute';
      overlayCard.style.left = `${rect.left - containerRect.left}px`;
      overlayCard.style.top = `${rect.top - containerRect.top}px`;
      overlayCard.style.width = `${rect.width}px`;
      overlayCard.style.height = `${rect.height}px`;
      overlayCard.style.transform = 'none';
      overlayCard.style.margin = '0';
      
    });
  };

  // Inicializar tarjetas overlay
  cards.forEach(initOverlayCard);
  
  // Sincronizar posiciones después de que se rendericen las tarjetas
  const syncPositions = () => {
    requestAnimationFrame(() => {
      cards.forEach((card, index) => {
        const overlayCard = overlay.children[index];
        if (overlayCard && card.isConnected) {
          const rect = card.getBoundingClientRect();
          const containerRect = cardsContainer.getBoundingClientRect();
          
          const left = rect.left - containerRect.left;
          const top = rect.top - containerRect.top;
          overlayCard.style.position = 'absolute';
          overlayCard.style.left = `${left}px`;
          overlayCard.style.top = `${top}px`;
          overlayCard.style.width = `${rect.width}px`;
          overlayCard.style.height = `${rect.height}px`;
          overlayCard.style.transform = 'none';
          overlayCard.style.margin = '0';
          
        }
      });
    });
  };
  
  // Sincronizar posiciones iniciales después de que se cargue todo
  setTimeout(syncPositions, 100);
  setTimeout(syncPositions, 300);
  window.addEventListener('resize', syncPositions);
  
  // Aplicar máscara cuando el puntero se mueve sobre las tarjetas
  cardsContainer.addEventListener("pointermove", applyOverlayMask);
  
  // Resetear overlay cuando el puntero sale del contenedor
  cardsContainer.addEventListener("pointerleave", resetOverlay);
  
}

