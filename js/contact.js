// contact.js (ESM - Módulo)
import emailjs from 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/+esm';
import { CONFIG } from './config.js';

// Validación de email mejorada
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Función para mostrar mensajes (compartida)
function mostrarMensaje(texto, tipo) {
  let contenedor = document.getElementById("mensaje-alerta");
  if (!contenedor) {
    // Si no existe el contenedor, crear uno temporal
    contenedor = document.createElement("div");
    contenedor.id = "mensaje-alerta";
    contenedor.style.position = "fixed";
    contenedor.style.top = "20px";
    contenedor.style.left = "50%";
    contenedor.style.transform = "translateX(-50%)";
    contenedor.style.zIndex = "9999";
    document.body.appendChild(contenedor);
  }

  contenedor.innerHTML = ""; // Limpiar mensajes anteriores

  const alerta = document.createElement("div");
  alerta.textContent = texto;
  alerta.className = `alerta ${tipo}`;
  alerta.setAttribute("role", "alert");
  alerta.setAttribute("aria-live", "polite");
  contenedor.appendChild(alerta);

  setTimeout(() => {
    alerta.remove();
    // Si es un contenedor temporal y no hay formulario, eliminarlo también
    if (contenedor.id === "mensaje-alerta" && !document.querySelector("#contact-form")) {
      contenedor.remove();
    }
  }, 4000);
}

// Exportar función para copiar al portapapeles
export function initContactPage() {
  const copyButtons = document.querySelectorAll('.copy-button');
  copyButtons.forEach(button => {
    button.addEventListener('click', function () {
      // Buscar el span que contiene el correo dentro del mismo contenedor
      const inputBox = this.parentElement;
      const emailSpan = inputBox.querySelector('span[aria-label="Correo electrónico"]');
      
      // Si encontramos el span, usar su texto, sino intentar extraer el correo del contenedor
      let textToCopy = '';
      if (emailSpan) {
        textToCopy = emailSpan.textContent.trim();
      } else {
        // Fallback: buscar cualquier texto que parezca un email en el contenedor
        const text = inputBox.textContent.trim();
        const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
        textToCopy = emailMatch ? emailMatch[0] : text.replace(/📋|copiar/gi, '').trim();
      }
      
      if (!textToCopy) {
        console.error('No se pudo encontrar el correo electrónico');
        mostrarMensaje("❌ No se pudo encontrar el correo electrónico", "error");
        return;
      }
      
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          const tooltip = this.querySelector('.tooltip');
          if (tooltip) {
            tooltip.textContent = '¡Copiado!';
            setTimeout(() => {
              tooltip.textContent = 'copiar';
            }, 2000);
          }
          console.log(`✅ Correo copiado: ${textToCopy}`);
        }).catch(err => {
          console.error('Error al copiar:', err);
          mostrarMensaje("❌ Error al copiar al portapapeles", "error");
        });
      } else {
        // Fallback para navegadores antiguos
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
          const tooltip = this.querySelector('.tooltip');
          if (tooltip) {
            tooltip.textContent = '¡Copiado!';
            setTimeout(() => {
              tooltip.textContent = 'copiar';
            }, 2000);
          }
          console.log(`✅ Correo copiado: ${textToCopy}`);
        } catch (err) {
          console.error('Error al copiar:', err);
          mostrarMensaje("❌ Error al copiar al portapapeles", "error");
        }
        document.body.removeChild(textArea);
      }
    });
  });
}

// Exportar función para inicializar el formulario de contacto
export function setupEmailForm() {
  emailjs.init(CONFIG.EMAILJS.PUBLIC_KEY);

  const form = document.getElementById("contact-form");
  if (!form) return;

  const nombreInput = form.nombre;
  const correoInput = form.correo;
  const mensajeInput = form.mensaje;
  const submitBtn = form.querySelector('button[type="submit"]');

  // Validación en tiempo real
  nombreInput.addEventListener('input', () => validateField(nombreInput, 'nombre'));
  correoInput.addEventListener('input', () => validateField(correoInput, 'email'));
  mensajeInput.addEventListener('input', () => validateField(mensajeInput, 'mensaje'));

  function validateField(field, type) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    field.classList.remove('error', 'success');

    if (!value) {
      isValid = false;
    } else {
      if (type === 'email' && !isValidEmail(value)) {
        isValid = false;
        errorMessage = 'Correo electrónico inválido';
      } else if (type === 'nombre' && value.length < 2) {
        isValid = false;
        errorMessage = 'El nombre debe tener al menos 2 caracteres';
      } else if (type === 'mensaje' && value.length < 10) {
        isValid = false;
        errorMessage = 'El mensaje debe tener al menos 10 caracteres';
      }
    }

    if (isValid && value) {
      field.classList.add('success');
    } else if (!isValid && value) {
      field.classList.add('error');
      if (errorMessage) {
        field.setAttribute('title', errorMessage);
      }
    }

    return isValid;
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const datos = {
      from_name: nombreInput.value.trim(),
      from_email: correoInput.value.trim(),
      message: mensajeInput.value.trim()
    };

    // Validación completa
    const isNombreValid = validateField(nombreInput, 'nombre');
    const isEmailValid = validateField(correoInput, 'email');
    const isMensajeValid = validateField(mensajeInput, 'mensaje');

    if (!isNombreValid || !isEmailValid || !isMensajeValid) {
      mostrarMensaje("❌ Por favor completa todos los campos correctamente", "error");
      return;
    }

    // Deshabilitar botón durante el envío
    submitBtn.disabled = true;
    submitBtn.setAttribute("aria-busy", "true");
    submitBtn.textContent = "Enviando...";

    try {
      await emailjs.send(
        CONFIG.EMAILJS.SERVICE_ID, 
        CONFIG.EMAILJS.TEMPLATE_ID, 
        datos
      );
      mostrarMensaje("✅ ¡Mensaje enviado correctamente!", "success");
      form.reset();
      // Limpiar clases de validación
      [nombreInput, correoInput, mensajeInput].forEach(field => {
        field.classList.remove('error', 'success');
      });
    } catch (error) {
      console.error("EmailJS error:", error);
      mostrarMensaje("❌ Error al enviar el mensaje. Por favor intenta más tarde.", "error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.removeAttribute("aria-busy");
      submitBtn.textContent = "Enviar";
    }
  });
}