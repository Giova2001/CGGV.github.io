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
    // Respuestas exactas para preguntas específicas del select
    DEFAULT_RESPONSES: {
      "Cuéntame sobre ti": "Soy un desarrollador con experiencia en JavaScript, React, Node.js y Java, enfocado en crear soluciones eficientes y escalables.",
      "Cuál es tu experiencia con [lenguaje o tecnología]": "He trabajado con diversas tecnologías en varios proyectos, incluyendo desarrollo web full-stack y aplicaciones móviles.",
      "Cómo manejas la depuración de errores": "Analizo cuidadosamente los logs, utilizo depuradores y pruebas unitarias para identificar y solucionar los problemas de manera sistemática.",
      "Qué proyecto te enorgullece más": "He trabajado en varios proyectos donde logré implementar soluciones innovadoras y mejorar la experiencia del usuario.",
      "Cómo priorizas tareas en un proyecto": "Utilizo metodologías ágiles como Scrum o Kanban para organizar las tareas según importancia y urgencia.",
      "Qué sabes sobre estructuras de datos y algoritmos": "Conozco listas, colas, pilas, árboles y grafos, y aplico algoritmos eficientes para resolver problemas de manera óptima.",
      "Por qué quieres trabajar en nuestra empresa": "Me interesa formar parte de su equipo por la oportunidad de crecer profesionalmente y contribuir con mis habilidades en desarrollo.",
      "Prefieres trabajar en equipo o individualmente": "Disfruto trabajar en equipo colaborando y compartiendo ideas, pero también puedo trabajar de manera independiente y eficiente.",
      "Cómo manejas el estrés o deadlines ajustados": "Mantengo la calma, priorizo tareas y busco soluciones eficientes para cumplir los objetivos sin comprometer la calidad.",
      "Cuál es tu meta profesional a 5 años": "Espero crecer como desarrollador, liderar proyectos y seguir aprendiendo nuevas tecnologías.",
      "hola": "Hola, ¿cómo estás? ¿En qué puedo ayudarte?",
      "hi": "Hola, ¿cómo estás? ¿En qué puedo ayudarte?",
      "hello": "Hola, ¿cómo estás? ¿En qué puedo ayudarte?"
    },
    
    // Sistema de palabras clave para reconocer preguntas similares
    KEYWORD_RESPONSES: [
      {
        keywords: ["sobre ti", "quién eres", "presentarte", "introduce", "cuéntame"],
        response: "Soy Christopher Giovanni Garcia, un desarrollador Full Stack apasionado por crear soluciones web, móviles y de escritorio. Me especializo en JavaScript, React, Node.js y Java."
      },
      {
        keywords: ["experiencia", "trabajaste", "proyectos", "tecnologías", "lenguajes"],
        response: "Tengo experiencia en desarrollo web full-stack. He trabajado con JavaScript, React, Node.js, Java, MySQL, MongoDB y herramientas como Git, Scrum y Figma."
      },
      {
        keywords: ["depuración", "debug", "errores", "bugs", "solucionar"],
        response: "Para depurar errores, analizo los logs cuidadosamente, uso herramientas de debugging del navegador, pruebas unitarias y sigo un enfoque sistemático para identificar y resolver problemas."
      },
      {
        keywords: ["proyecto", "enorgullece", "mejor", "destacar", "favorito"],
        response: "Me enorgullece haber trabajado en proyectos donde pude implementar soluciones innovadoras, mejorar la experiencia del usuario y aplicar las mejores prácticas de desarrollo."
      },
      {
        keywords: ["priorizar", "tareas", "organizar", "metodología", "ágil"],
        response: "Utilizo metodologías ágiles como Scrum o Kanban. Priorizo tareas según su importancia, urgencia e impacto, organizándolas en sprints y manteniendo un backlog ordenado."
      },
      {
        keywords: ["estructuras de datos", "algoritmos", "programación", "lógica"],
        response: "Tengo conocimientos sólidos de estructuras de datos (listas, colas, pilas, árboles, grafos) y algoritmos eficientes. Me gusta aplicar estos conceptos para resolver problemas de manera óptima."
      },
      {
        keywords: ["empresa", "trabajar", "por qué", "interesado", "motivación"],
        response: "Me interesa trabajar en su empresa porque veo una oportunidad de crecer profesionalmente, aprender de un equipo experimentado y contribuir con mis habilidades técnicas al éxito del proyecto."
      },
      {
        keywords: ["equipo", "individual", "solo", "colaborar", "trabajar con"],
        response: "Disfruto trabajar en equipo, donde puedo colaborar, compartir ideas y aprender de otros. También puedo trabajar de manera independiente cuando es necesario, siendo autodisciplinado y eficiente."
      },
      {
        keywords: ["estrés", "deadline", "presión", "tiempo", "ajustado"],
        response: "Mantengo la calma bajo presión. Priorizo tareas, busco soluciones eficientes y me comunico proactivamente si necesito ayuda o ajustes en los plazos, siempre manteniendo la calidad del código."
      },
      {
        keywords: ["meta", "objetivo", "futuro", "5 años", "aspiraciones", "plan"],
        response: "Mi meta a 5 años es crecer como desarrollador senior, liderar proyectos técnicos, mentorizar a otros desarrolladores y seguir aprendiendo las últimas tecnologías y tendencias del sector."
      },
      {
        keywords: ["habilidades", "skills", "conocimientos", "sabes", "puedes"],
        response: "Tengo experiencia en Frontend (HTML5, CSS3, JavaScript, React), Backend (Node.js, Java), bases de datos (MySQL, MongoDB) y herramientas como Git, Scrum y Figma."
      },
      {
        keywords: ["educación", "estudios", "formación", "universidad", "carrera"],
        response: "Me he formado en desarrollo de software, adquiriendo conocimientos tanto de forma autodidacta como a través de cursos y proyectos prácticos. Estoy en constante aprendizaje."
      },
      {
        keywords: ["contacto", "correo", "email", "teléfono", "comunicar"],
        response: "Puedes contactarme por correo: tecnostore141@gmail.com o teléfono: 76123007. También estoy disponible en LinkedIn y GitHub. ¡Estoy abierto a nuevas oportunidades!"
      },
      {
        keywords: ["hola", "hi", "hello", "buenos días", "buenas tardes", "saludo"],
        response: "¡Hola! Soy un chatbot diseñado para responder preguntas sobre Christopher. ¿En qué puedo ayudarte? Puedes preguntarme sobre su experiencia, proyectos o habilidades."
      },
      {
        keywords: ["gracias", "thanks", "thank you", "agradecido"],
        response: "De nada, ¡fue un placer ayudarte! Si tienes más preguntas, estaré aquí. ¡Que tengas un excelente día!"
      },
      {
        keywords: ["adiós", "bye", "goodbye", "chao", "nos vemos"],
        response: "¡Hasta luego! Si tienes más preguntas, no dudes en volver. ¡Éxito en tu búsqueda!"
      }
    ],
    
    // Respuestas por defecto si no se encuentra coincidencia
    DEFAULT_FALLBACK: [
      "Entiendo tu pregunta, pero sería mejor si pudieras reformularla o elegir una de las opciones del menú.",
      "Esa es una pregunta interesante. ¿Podrías ser más específico o usar una de las preguntas predefinidas del menú?",
      "No estoy seguro de cómo responder eso. ¿Podrías preguntar sobre mi experiencia, habilidades, proyectos o metodologías de trabajo?",
      "Para ayudarte mejor, puedes seleccionar una pregunta del menú o preguntarme sobre mi experiencia, proyectos, habilidades técnicas o metodologías de trabajo."
    ]
  }
};


