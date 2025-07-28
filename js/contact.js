// contact.js (ESM - Módulo)
import emailjs from 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/+esm';

// Exportar función para copiar al portapapeles
export function initContactPage() {
  const copyButtons = document.querySelectorAll('.copy-button');
  copyButtons.forEach(button => {
    button.addEventListener('click', function () {
      const textToCopy = this.parentElement.textContent.trim().replace('📋 copiar', '');
      navigator.clipboard.writeText(textToCopy);

      const tooltip = this.querySelector('.tooltip');
      if (tooltip) {
        tooltip.textContent = '¡Copiado!';
        setTimeout(() => {
          tooltip.textContent = 'copiar';
        }, 2000);
      }
    });
  });
}

// Exportar función para inicializar el formulario de contacto
export function setupEmailForm() {
  emailjs.init("rx3BqKZH0q48QpZUc"); // Tu public key

  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const datos = {
      from_name: form.nombre.value.trim(),
      from_email: form.correo.value.trim(),
      message: form.mensaje.value.trim()
    };

    // Validación
    if (!datos.from_name || !datos.from_email || !datos.message) {
      mostrarMensaje("❌ Por favor completa todos los campos", "error");
      return;
    }

    if (!datos.from_email.includes('@')) {
      mostrarMensaje("❌ Por favor ingresa un correo válido", "error");
      return;
    }

    try {
      await emailjs.send("service_705u2to", "template_3za2nec", datos);
      mostrarMensaje("✅ ¡Mensaje enviado correctamente!", "success");
      form.reset();
    } catch (error) {
      mostrarMensaje("❌ Error al enviar el mensaje. Inténtalo más tarde.", "error");
      console.error("EmailJS error:", error);
    }
  });

  function mostrarMensaje(texto, tipo) {
    const contenedor = document.getElementById("mensaje-alerta");
    if (!contenedor) return;

    contenedor.innerHTML = ""; // Limpiar mensajes anteriores

    const alerta = document.createElement("div");
    alerta.textContent = texto;
    alerta.className = `alerta ${tipo}`;
    contenedor.appendChild(alerta);

    setTimeout(() => {
      alerta.remove();
    }, 4000);
  }
}