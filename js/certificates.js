export function initCertificatesCarousel() {
  const carouselContainer = document.getElementById('carouselContainer');
  const carouselIndicators = document.getElementById('carouselIndicators');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  if (!carouselContainer || !carouselIndicators || !prevBtn || !nextBtn) return;

  async function findCertFiles() {
    const maxFiles = 20;
    const foundFiles = [];
    let consecutiveFails = 0;
    const maxConsecutiveFails = 3;

    for (let i = 1; i <= maxFiles; i++) {
      const num = i.toString().padStart(2, '0');
      const filePath = `image/certs/${num}.pdf`;
      try {
        const response = await fetch(filePath, { method: 'HEAD' });
        if (response.ok) {
          foundFiles.push({ path: filePath, order: i });
          consecutiveFails = 0;
        } else {
          consecutiveFails++;
          if (consecutiveFails >= maxConsecutiveFails) break;
        }
      } catch (error) {
        consecutiveFails++;
        if (consecutiveFails >= maxConsecutiveFails) break;
      }
    }
    return foundFiles.map((result, index) => ({ path: result.path, index }));
  }

  async function loadCarousel() {
    try {
      const availableFiles = await findCertFiles();
      if (availableFiles.length === 0) {
        carouselContainer.innerHTML = '<p class="no-certificates">No hay certificados disponibles</p>';
        return;
      }

      carouselContainer.innerHTML = '';
      carouselIndicators.innerHTML = '';

      availableFiles.forEach((file, index) => {
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';
        if (index === 0) slide.classList.add('active');
        slide.setAttribute('aria-hidden', index === 0 ? 'false' : 'true');
        slide.id = `slide-${index}`;

        const pdfContainer = document.createElement('div');
        pdfContainer.className = 'pdf-container';

        const iframe = document.createElement('iframe');
        iframe.className = 'pdf-viewer';
        const pdfParams = '#toolbar=0&navpanes=0&scrollbar=1';

        // Lazy Loading: Solo el primero tiene src real
        if (index === 0) {
          iframe.src = file.path + pdfParams;
        } else {
          iframe.setAttribute('data-src', file.path + pdfParams);
        }

        pdfContainer.appendChild(iframe);
        slide.appendChild(pdfContainer);
        carouselContainer.appendChild(slide);

        const indicator = document.createElement('button');
        indicator.className = 'carousel-indicator';
        if (index === 0) indicator.classList.add('active');
        indicator.addEventListener('click', () => goToSlide(index));
        carouselIndicators.appendChild(indicator);
      });

      let currentSlide = 0;
      const totalSlides = availableFiles.length;

      // FUNCIÓN DE AJUSTE DINÁMICO
      function updateCarousel() {
        const slides = carouselContainer.querySelectorAll('.carousel-slide');
        const indicators = carouselIndicators.querySelectorAll('.carousel-indicator');

        slides.forEach((slide, index) => {
          const isActive = index === currentSlide;
          slide.classList.toggle('active', isActive);
          slide.setAttribute('aria-hidden', !isActive);

          if (isActive) {
            const iframe = slide.querySelector('.pdf-viewer');
            const dataSrc = iframe.getAttribute('data-src');
            if (dataSrc && !iframe.src) {
              iframe.src = dataSrc;
            }
          }
        });

        indicators.forEach((ind, index) => {
          ind.classList.toggle('active', index === currentSlide);
        });
      }

      function goToSlide(index) {
        currentSlide = index;
        updateCarousel();
      }

      function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
      }

      function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateCarousel();
      }

      // EVENTOS DE NAVEGACIÓN
      nextBtn.addEventListener('click', nextSlide);
      prevBtn.addEventListener('click', prevSlide);

      // --- SOLUCIÓN AL CAMBIO DE VENTANAS (SPA) ---
      
      // 1. Detectar cuando el elemento se vuelve visible (cambio de sección)
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            console.log("Sección visible, reajustando carrusel...");
            updateCarousel(); // Fuerza el cálculo de dimensiones
          }
        });
      }, { threshold: 0.1 });

      observer.observe(carouselContainer);

      // 2. Ajuste inmediato al cambiar tamaño de pantalla
      window.addEventListener('resize', updateCarousel);

      updateCarousel();
    } catch (e) {
      console.error(e);
    }
  }

  loadCarousel();
}