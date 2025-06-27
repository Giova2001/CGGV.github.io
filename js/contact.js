// contact.js
export function initContactPage() {
  const copyButtons = document.querySelectorAll('.copy-button');
  if (!copyButtons.length) return;

  copyButtons.forEach(button => {
    button.addEventListener('click', function() {
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