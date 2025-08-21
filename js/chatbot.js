export function initChatBot() {
    console.log("🤖 Chatbot inicializado!");

    const chatBox = document.querySelector(".chat-box");
    const input = document.getElementById("user-input");
    const sendBtn = document.getElementById("send-btn");
    const questionSelect = document.getElementById("questionSelect");
    const sendSelectBtn = document.getElementById("sendSelectBtn");

    if (!chatBox) return;

    // Limpiar mensajes previos
    chatBox.innerHTML = "";

    const respuestas = {
        "Cuéntame sobre ti": "📌 Soy un desarrollador con experiencia en [tu lenguaje/tecnología], enfocado en crear soluciones eficientes y escalables.",
        "Cuál es tu experiencia con [lenguaje o tecnología]": "💻 He trabajado con [lenguaje/tecnología] en varios proyectos, incluyendo [breve ejemplo de proyecto].",
        "Cómo manejas la depuración de errores": "🔧 Analizo cuidadosamente los logs, utilizo depuradores y pruebas unitarias para identificar y solucionar los problemas.",
        "Qué proyecto te enorgullece más": "🚀 He trabajado en [nombre del proyecto], donde logré [resultado destacado].",
        "Cómo priorizas tareas en un proyecto": "📊 Utilizo metodologías ágiles como Scrum o Kanban para organizar las tareas según importancia y urgencia.",
        "Qué sabes sobre estructuras de datos y algoritmos": "📚 Conozco listas, colas, pilas, árboles y grafos, y aplico algoritmos eficientes para resolver problemas de manera óptima.",
        "Por qué quieres trabajar en nuestra empresa": "🏢 Me interesa formar parte de su equipo por [motivo], y contribuir con mis habilidades en [área].",
        "Prefieres trabajar en equipo o individualmente": "🤝 Disfruto trabajar en equipo colaborando y compartiendo ideas, pero también puedo trabajar de manera independiente y eficiente.",
        "Cómo manejas el estrés o deadlines ajustados": "⏱️ Mantengo la calma, priorizo tareas y busco soluciones eficientes para cumplir los objetivos sin comprometer la calidad.",
        "Cuál es tu meta profesional a 5 años": "🎯 Espero crecer como desarrollador, liderar proyectos y seguir aprendiendo nuevas tecnologías.",
        "hola":"hola como estas, como puedo ayudarte"
    };

    // Mensajes iniciales
    addMessage("bot", "👋 Hola, soy una IA entrenada para entrevistas.");
    addMessage("bot", "Selecciona una pregunta del desplegable o escribe tu propia pregunta.");

    function addMessage(sender, text) {
        const div = document.createElement("div");
        div.className = sender === "bot" ? "bot-msg" : "user-msg";
        div.textContent = text;
        chatBox.appendChild(div);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Enviar pregunta desde select
    sendSelectBtn.addEventListener("click", () => {
        const pregunta = questionSelect.value;
        if (!pregunta) return;
        addMessage("user", pregunta);
        addMessage("bot", respuestas[pregunta] || "🤔 Lo siento, no tengo respuesta para eso.");
        questionSelect.selectedIndex = 0;
    });

    // Enviar pregunta manual
    sendBtn.addEventListener("click", sendQuestion);
    input.addEventListener("keypress", (e) => { if(e.key === "Enter") sendQuestion(); });

    function sendQuestion() {
        const userText = input.value.trim();
        if (!userText) return;
        addMessage("user", userText);
        addMessage("bot", respuestas[userText] || "🤔 Lo siento, no tengo respuesta para eso.");
        input.value = "";
    }
}
