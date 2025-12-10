# Portafolio Web - Christopher Giovanni Garcia Vasquez

Portafolio web personal desarrollado con HTML5, CSS3 y JavaScript vanilla. Incluye un chatbot de entrevistas con integración a OpenAI, formulario de contacto con EmailJS, y diseño responsive con soporte para tema claro/oscuro.

##  Características

- **Diseño Responsive**: Optimizado para dispositivos móviles, tablets y desktop
- **Tema Claro/Oscuro**: Persistencia del tema seleccionado en localStorage
- **Chatbot de Entrevistas**: IA entrenada para responder preguntas comunes de entrevistas
- **Formulario de Contacto**: Integración con EmailJS para envío de mensajes
- **Navegación SPA**: Carga dinámica de contenido sin recargar la página
- **Accesibilidad**: Implementación de ARIA labels y navegación por teclado
- **SEO Optimizado**: Meta tags y Open Graph para mejor indexación

##  Estructura del Proyecto

```
giovacv.github.io/
├── index.html          # Página principal
├── home.html          # Página de inicio
├── chatbot.html       # Página del chatbot
├── contact.html       # Página de contacto
├── css/
│   ├── style.css      # Estilos generales
│   ├── responsive.css # Media queries y responsive design
│   ├── home.css       # Estilos de la página de inicio
│   ├── ChatBot.css    # Estilos del chatbot
│   ├── contact.css    # Estilos del formulario de contacto
│   └── stars.css      # Efectos de estrellas animadas
├── js/
│   ├── main.js        # Punto de entrada principal
│   ├── config.js      # Configuración del proyecto
│   ├── theme.js       # Gestión del tema claro/oscuro
│   ├── menu.js        # Funcionalidad del menú lateral
│   ├── contentLoader.js # Carga dinámica de contenido
│   ├── chatbot.js     # Lógica del chatbot
│   ├── contact.js     # Lógica del formulario de contacto
│   └── stars.js       # Animación de estrellas
└── image/
    ├── yo.jpg         # Foto de perfil
    └── persona.png    # Icono de contacto
```

##  Tecnologías Utilizadas

- **HTML5**: Estructura semántica y accesible
- **CSS3**: Variables CSS, Flexbox, Grid, Animaciones
- **JavaScript (ES6+)**: Módulos ES6, async/await, Fetch API
- **EmailJS**: Servicio para envío de emails desde el frontend
- **OpenAI API**: Integración con backend para respuestas del chatbot

##  Configuración

### Variables de Entorno

El archivo `js/config.js` contiene la configuración del proyecto:

```javascript
export const CONFIG = {
  EMAILJS: {
    PUBLIC_KEY: "tu-public-key",
    SERVICE_ID: "tu-service-id",
    TEMPLATE_ID: "tu-template-id"
  },
  API: {
    BASE_URL: "http://localhost:3000", // Cambiar en producción
    ENDPOINTS: {
      CHAT: "/chat"
    }
  }
};
```

### EmailJS Setup

1. Crea una cuenta en [EmailJS](https://www.emailjs.com/)
2. Configura un servicio de email
3. Crea una plantilla de email
4. Actualiza las credenciales en `js/config.js`

### Backend del Chatbot

El chatbot requiere un backend que maneje las peticiones a OpenAI. Ejemplo de endpoint:

```javascript
POST /chat
Body: { prompt: "tu pregunta" }
Response: { reply: "respuesta del chatbot" }
```

##  Instalación y Uso

1. Clona el repositorio:
```bash
git clone https://github.com/giovacv/giovacv.github.io.git
```

2. Abre `index.html` en tu navegador o usa un servidor local:
```bash
# Con Python
python -m http.server 8000

# Con Node.js (http-server)
npx http-server
```

3. Accede a `http://localhost:8000`

##  Responsive Design

El proyecto está optimizado para:
- **Desktop**: > 768px
- **Tablet**: 481px - 768px
- **Móvil Grande**: 481px - 600px
- **Móvil Pequeño**: < 480px

##  Accesibilidad

- Atributos ARIA para lectores de pantalla
- Navegación por teclado (Tab, Enter, Escape)
- Contraste de colores adecuado
- Etiquetas semánticas HTML5
- Focus visible en elementos interactivos

##  Personalización

### Cambiar Colores

Edita las variables CSS en `css/style.css`:

```css
:root {
  --bg-color: #1e1e2f;
  --text-color: #ffffff;
  --card-bg: rgb(41, 41, 61);
  --hover-bg: #8f50f5c0;
}
```

### Personalizar Respuestas del Chatbot

Edita `js/config.js` en la sección `CHATBOT.DEFAULT_RESPONSES`.

##  Mejoras Futuras

- [ ] Agregar más proyectos al portafolio
- [ ] Implementar PWA (Progressive Web App)
- [ ] Agregar animaciones más suaves
- [ ] Mejorar el sistema de notificaciones
- [ ] Agregar modo offline
- [ ] Implementar lazy loading de imágenes

##  Licencia

Este proyecto es de uso personal. Todos los derechos reservados.

##  Autor

**Christopher Giovanni Garcia Vasquez**
- Email: tecnostore141@gmail.com
- GitHub: [@giovacv](https://github.com/giovacv)

---

 Si te gusta este proyecto, ¡dale una estrella!


