// certificates.js - Script para cargar y mostrar certificados en un carrusel

/**
 * Inicializa el carrusel de certificados
 * Carga dinámicamente todos los PDFs de la carpeta image/certs/
 */
export function initCertificatesCarousel() {
  console.log(" Inicializando carrusel de certificados...");

  const carouselContainer = document.getElementById('carouselContainer');
  const carouselIndicators = document.getElementById('carouselIndicators');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  if (!carouselContainer || !carouselIndicators || !prevBtn || !nextBtn) {
    console.error(" Elementos del carrusel no encontrados");
    return;
  }

  // Intentar encontrar todos los archivos PDF disponibles
  // Empezamos desde 01.pdf y vamos incrementando hasta que no encontremos más
  async function findCertFiles() {
    const maxFiles = 20; // Límite máximo para evitar bucles infinitos
    const promises = [];

    // Verificar archivos en paralelo para mejor rendimiento
    for (let i = 1; i <= maxFiles; i++) {
      const num = i.toString().padStart(2, '0'); // 01, 02, 03, etc.
      const filePath = `image/certs/${num}.pdf`;
      
      promises.push(
        fetch(filePath, { method: 'HEAD' })
          .then(response => {
            if (response.ok) {
              return { path: filePath, order: i };
            }
            return null;
          })
          .catch(() => null)
      );
    }

    const results = await Promise.all(promises);
    // Filtrar nulos y ordenar por el número de orden
    return results
      .filter(result => result !== null)
      .sort((a, b) => a.order - b.order)
      .map((result, index) => ({ path: result.path, index }));
  }

  // Cargar y crear el carrusel
  async function loadCarousel() {
    try {
      const availableFiles = await findCertFiles();
      
      if (availableFiles.length === 0) {
        console.warn(" No se encontraron archivos PDF en image/certs/");
        carouselContainer.innerHTML = '<p class="no-certificates">No hay certificados disponibles</p>';
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
        return;
      }

      console.log(` Se encontraron ${availableFiles.length} certificados`);

      // Limpiar contenedores
      carouselContainer.innerHTML = '';
      carouselIndicators.innerHTML = '';

      // Crear elementos del carrusel
      availableFiles.forEach((file, index) => {
        // Crear slide del carrusel
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';
        slide.setAttribute('data-index', index);
        slide.setAttribute('role', 'tabpanel');
        slide.setAttribute('aria-hidden', index === 0 ? 'false' : 'true');
        slide.id = `slide-${index}`;

        // Crear contenedor del PDF
        const pdfContainer = document.createElement('div');
        pdfContainer.className = 'pdf-container';

        // Crear iframe para mostrar el PDF (sin permitir descarga)
        const iframe = document.createElement('iframe');
        // Agregar parámetros para ocultar la barra de herramientas del PDF viewer y prevenir descarga
        // toolbar=0: oculta barra de herramientas
        // navpanes=0: oculta paneles de navegación
        // scrollbar=1: permite scrollbar
        iframe.src = file.path + '#toolbar=0&navpanes=0&scrollbar=1';
        iframe.className = 'pdf-viewer';
        iframe.setAttribute('title', `Certificado ${index + 1}`);
        iframe.setAttribute('aria-label', `Certificado ${index + 1}`);
        
        // Prevenir clic derecho en el contenedor del PDF
        pdfContainer.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }, true);

        // Prevenir arrastrar y soltar archivos
        pdfContainer.addEventListener('dragstart', (e) => {
          e.preventDefault();
          return false;
        }, true);
        
        pdfContainer.addEventListener('drag', (e) => {
          e.preventDefault();
          return false;
        }, true);

        // Prevenir selección de texto
        pdfContainer.addEventListener('selectstart', (e) => {
          e.preventDefault();
          return false;
        }, true);

        pdfContainer.appendChild(iframe);
        
        // Agregar overlay para prevenir interacciones directas (no bloquea el scroll del iframe)
        const overlay = document.createElement('div');
        overlay.className = 'pdf-overlay';
        overlay.setAttribute('title', 'La descarga está deshabilitada');
        pdfContainer.appendChild(overlay);
        slide.appendChild(pdfContainer);
        carouselContainer.appendChild(slide);

        // Crear indicador
        const indicator = document.createElement('button');
        indicator.className = 'carousel-indicator';
        indicator.setAttribute('role', 'tab');
        indicator.setAttribute('aria-label', `Ir al certificado ${index + 1}`);
        indicator.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
        indicator.setAttribute('tabindex', index === 0 ? '0' : '-1');
        indicator.addEventListener('click', () => goToSlide(index));
        carouselIndicators.appendChild(indicator);
      });

      // Inicializar variables de estado
      let currentSlide = 0;
      const totalSlides = availableFiles.length;
      let autoPlayInterval = null;
      const AUTO_PLAY_DELAY = 5000; // 5 segundos entre cambios automáticos

      // Función para actualizar el carrusel
      function updateCarousel() {
        const slides = carouselContainer.querySelectorAll('.carousel-slide');
        const indicators = carouselIndicators.querySelectorAll('.carousel-indicator');

        slides.forEach((slide, index) => {
          const isActive = index === currentSlide;
          slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');
          slide.classList.toggle('active', isActive);
        });

        indicators.forEach((indicator, index) => {
          const isActive = index === currentSlide;
          indicator.setAttribute('aria-selected', isActive ? 'true' : 'false');
          indicator.setAttribute('tabindex', isActive ? '0' : '-1');
          indicator.classList.toggle('active', isActive);
        });

        // Actualizar visibilidad de botones
        prevBtn.style.display = totalSlides > 1 ? 'flex' : 'none';
        nextBtn.style.display = totalSlides > 1 ? 'flex' : 'none';
      }

      // Función para iniciar el auto-play
      function startAutoPlay() {
        // Limpiar intervalo anterior si existe
        stopAutoPlay();
        
        // Solo iniciar auto-play si hay más de un slide
        if (totalSlides > 1) {
          autoPlayInterval = setInterval(() => {
            nextSlide();
          }, AUTO_PLAY_DELAY);
        }
      }

      // Función para detener el auto-play
      function stopAutoPlay() {
        if (autoPlayInterval) {
          clearInterval(autoPlayInterval);
          autoPlayInterval = null;
        }
      }

      // Función para reiniciar el auto-play (después de interacción manual)
      function restartAutoPlay() {
        stopAutoPlay();
        // Reiniciar después de un pequeño delay para que el usuario vea el cambio manual
        setTimeout(() => {
          startAutoPlay();
        }, 1000);
      }

      // Función para ir a un slide específico
      function goToSlide(index) {
        if (index < 0 || index >= totalSlides) return;
        currentSlide = index;
        updateCarousel();
        restartAutoPlay(); // Reiniciar auto-play después de cambio manual
      }

      // Función para ir al siguiente slide
      function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
      }

      // Función para ir al slide anterior
      function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateCarousel();
        restartAutoPlay(); // Reiniciar auto-play después de cambio manual
      }

      // Obtener el contenedor del carrusel para eventos de hover
      const certificatesCarousel = document.getElementById('certificatesCarousel');

      // Pausar auto-play cuando el usuario interactúa con el carrusel
      if (certificatesCarousel) {
        certificatesCarousel.addEventListener('mouseenter', () => {
          stopAutoPlay();
        });

        // Reanudar auto-play cuando el usuario deja de interactuar
        certificatesCarousel.addEventListener('mouseleave', () => {
          startAutoPlay();
        });
      }

      // Event listeners
      nextBtn.addEventListener('click', () => {
        nextSlide();
        restartAutoPlay();
      });

      prevBtn.addEventListener('click', () => {
        prevSlide();
        restartAutoPlay();
      });

      // Navegación con teclado
      carouselContainer.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          prevSlide();
          restartAutoPlay();
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          nextSlide();
          restartAutoPlay();
        }
      });

      // Inicializar carrusel
      updateCarousel();
      
      // Iniciar auto-play
      startAutoPlay();

      console.log(" Carrusel de certificados inicializado correctamente");
    } catch (error) {
      console.error(" Error al cargar el carrusel:", error);
      carouselContainer.innerHTML = '<p class="error-certificates">Error al cargar los certificados. Por favor, recarga la página.</p>';
    }
  }

  // Iniciar carga
  loadCarousel();
}

