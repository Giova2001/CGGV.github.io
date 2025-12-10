// Configuración del proyecto
export const CONFIG = {
  // EmailJS Configuration
  EMAILJS: {
    PUBLIC_KEY: "rx3BqKZH0q48QpZUc",
    SERVICE_ID: "service_705u2to",
    TEMPLATE_ID: "template_3za2nec"
  },
  
  // Backend API Configuration
  API: {
    // Cambiar a la URL de producción cuando esté lista
    // Para producción, cambia esta URL manualmente o usa variables de entorno en el servidor
    BASE_URL: "http://localhost:3000",
    ENDPOINTS: {
      CHAT: "/chat"
    }
  },
  
  // Chatbot Configuration
  CHATBOT: {
    DEFAULT_RESPONSES: {
      "Cuéntame sobre ti": "📌 Soy un desarrollador con experiencia en JavaScript, React, Node.js y Java, enfocado en crear soluciones eficientes y escalables.",
      "Cuál es tu experiencia con [lenguaje o tecnología]": "💻 He trabajado con diversas tecnologías en varios proyectos, incluyendo desarrollo web full-stack y aplicaciones móviles.",
      "Cómo manejas la depuración de errores": "🔧 Analizo cuidadosamente los logs, utilizo depuradores y pruebas unitarias para identificar y solucionar los problemas de manera sistemática.",
      "Qué proyecto te enorgullece más": "🚀 He trabajado en varios proyectos donde logré implementar soluciones innovadoras y mejorar la experiencia del usuario.",
      "Cómo priorizas tareas en un proyecto": "📊 Utilizo metodologías ágiles como Scrum o Kanban para organizar las tareas según importancia y urgencia.",
      "Qué sabes sobre estructuras de datos y algoritmos": "📚 Conozco listas, colas, pilas, árboles y grafos, y aplico algoritmos eficientes para resolver problemas de manera óptima.",
      "Por qué quieres trabajar en nuestra empresa": "🏢 Me interesa formar parte de su equipo por la oportunidad de crecer profesionalmente y contribuir con mis habilidades en desarrollo.",
      "Prefieres trabajar en equipo o individualmente": "🤝 Disfruto trabajar en equipo colaborando y compartiendo ideas, pero también puedo trabajar de manera independiente y eficiente.",
      "Cómo manejas el estrés o deadlines ajustados": "⏱️ Mantengo la calma, priorizo tareas y busco soluciones eficientes para cumplir los objetivos sin comprometer la calidad.",
      "Cuál es tu meta profesional a 5 años": "🎯 Espero crecer como desarrollador, liderar proyectos y seguir aprendiendo nuevas tecnologías.",
      "hola": "Hola, ¿cómo estás? ¿En qué puedo ayudarte?"
    }
  }
};


