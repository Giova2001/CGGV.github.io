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
    const foundFiles = [];
    let consecutiveFails = 0; // Contador de fallos consecutivos
    const maxConsecutiveFails = 3; // Dejar de buscar después de 3 fallos consecutivos

    // Verificar archivos secuencialmente para detener cuando no haya más archivos
    for (let i = 1; i <= maxFiles; i++) {
      const num = i.toString().padStart(2, '0'); // 01, 02, 03, etc.
      const filePath = `image/certs/${num}.pdf`;

      try {
        const response = await fetch(filePath, { method: 'HEAD' });
        if (response.ok) {
          foundFiles.push({ path: filePath, order: i });
          consecutiveFails = 0; // Resetear contador de fallos
        } else {
          consecutiveFails++;
          // Si hay 3 fallos consecutivos, asumir que no hay más archivos
          if (consecutiveFails >= maxConsecutiveFails) {
            break;
          }
        }
      } catch (error) {
        consecutiveFails++;
        // Si hay 3 fallos consecutivos, asumir que no hay más archivos
        if (consecutiveFails >= maxConsecutiveFails) {
          break;
        }
      }
    }

    // Mapear con índice para el carrusel
    return foundFiles.map((result, index) => ({ path: result.path, index }));
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
        if (index === 0) {
          slide.classList.add('active');
        }
        slide.setAttribute('data-index', index);
        slide.setAttribute('role', 'tabpanel');
        slide.setAttribute('aria-hidden', index === 0 ? 'false' : 'true');
        slide.id = `slide-${index}`;

        const pdfContainer = document.createElement('div');
        pdfContainer.className = 'pdf-container';

        // Crear iframe con Lazy Loading para móviles
        const iframe = document.createElement('iframe');
        iframe.className = 'pdf-viewer';
        iframe.setAttribute('title', `Certificado ${index + 1}`);
        iframe.setAttribute('aria-label', `Certificado ${index + 1}`);

        // PARÁMETROS DE PDF
        const pdfParams = '#toolbar=0&navpanes=0&scrollbar=1';

        // Solo cargamos el primer PDF de inmediato, los demás bajo demanda
        if (index === 0) {
          iframe.src = file.path + pdfParams;
        } else {
          // Guardamos la ruta en un atributo de datos para cargarla luego
          iframe.setAttribute('data-src', file.path + pdfParams);
        }

        // Bloqueos de seguridad (clic derecho, arrastrar, etc.)
        pdfContainer.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          e.stopPropagation();
        }, true);

        pdfContainer.addEventListener('dragstart', (e) => e.preventDefault(), true);
        pdfContainer.addEventListener('selectstart', (e) => e.preventDefault(), true);

        pdfContainer.appendChild(iframe);

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
        if (index === 0) indicator.classList.add('active');

        indicator.addEventListener('click', () => goToSlide(index));
        carouselIndicators.appendChild(indicator);
      });

      // Inicializar variables de estado
      let currentSlide = 0;
      const totalSlides = availableFiles.length;
      let autoPlayInterval = null;
      const AUTO_PLAY_DELAY = 5000;

      // Función para actualizar el carrusel (INCLUYE CARGA DINÁMICA)
      function updateCarousel() {
        const slides = carouselContainer.querySelectorAll('.carousel-slide');
        const indicators = carouselIndicators.querySelectorAll('.carousel-indicator');

        slides.forEach((slide, index) => {
          const isActive = index === currentSlide;
          slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');
          slide.classList.toggle('active', isActive);

          // LOGICA DE CARGA DINÁMICA: Si el slide es el activo, cargar el iframe si no tiene src
          if (isActive) {
            const iframe = slide.querySelector('.pdf-viewer');
            const dataSrc = iframe.getAttribute('data-src');
            if (dataSrc && !iframe.src) {
              console.log(`Cargando certificado ${index + 1} para móvil...`);
              iframe.src = dataSrc;
            }
          }
        });

        indicators.forEach((indicator, index) => {
          const isActive = index === currentSlide;
          indicator.setAttribute('aria-selected', isActive ? 'true' : 'false');
          indicator.setAttribute('tabindex', isActive ? '0' : '-1');
          indicator.classList.toggle('active', isActive);
        });

        prevBtn.style.display = totalSlides > 1 ? 'flex' : 'none';
        nextBtn.style.display = totalSlides > 1 ? 'flex' : 'none';
      }

      function startAutoPlay() {
        stopAutoPlay();
        if (totalSlides > 1) {
          autoPlayInterval = setInterval(() => {
            nextSlide();
          }, AUTO_PLAY_DELAY);
        }
      }

      function stopAutoPlay() {
        if (autoPlayInterval) {
          clearInterval(autoPlayInterval);
          autoPlayInterval = null;
        }
      }

      function restartAutoPlay() {
        stopAutoPlay();
        setTimeout(() => startAutoPlay(), 1000);
      }

      function goToSlide(index) {
        if (index < 0 || index >= totalSlides) return;
        currentSlide = index;
        updateCarousel();
        restartAutoPlay();
      }

      function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
      }

      function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateCarousel();
        restartAutoPlay();
      }

      // Event Listeners
      const certificatesCarousel = document.getElementById('certificatesCarousel');
      if (certificatesCarousel) {
        certificatesCarousel.addEventListener('mouseenter', stopAutoPlay);
        certificatesCarousel.addEventListener('mouseleave', startAutoPlay);
      }

      nextBtn.addEventListener('click', () => {
        nextSlide();
        restartAutoPlay();
      });

      prevBtn.addEventListener('click', () => {
        prevSlide();
        restartAutoPlay();
      });

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
      startAutoPlay();

      console.log(" Carrusel de certificados inicializado correctamente con Lazy Loading");
    } catch (error) {
      console.error(" Error al cargar el carrusel:", error);
      carouselContainer.innerHTML = '<p class="error-certificates">Error al cargar los certificados. Por favor, recarga la página.</p>';
    }
  }
  // Iniciar carga
  loadCarousel();
}
