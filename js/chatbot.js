import { CONFIG } from './config.js';

export function initChatBot() {
    console.log("Chatbot inicializado!");

    // 1. Selección de elementos y Limpieza de duplicados (Blindaje)
    const chatBox = document.querySelector(".chat-box");
    const oldInput = document.getElementById("user-input");
    const oldSendBtn = document.getElementById("send-btn");
    
    // Clonamos para eliminar cualquier event listener previo que cause "réplicas"
    const input = oldInput.cloneNode(true);
    const sendBtn = oldSendBtn.cloneNode(true);
    oldInput.parentNode.replaceChild(input, oldInput);
    oldSendBtn.parentNode.replaceChild(sendBtn, oldSendBtn);

    const questionButtons = document.querySelectorAll(".question-btn");
    const questionsToggle = document.getElementById("questionsToggle");
    const questionsSidebar = document.querySelector(".questions-sidebar");
    const closeQuestionsBtn = document.getElementById("closeQuestionsBtn");
    const questionsOverlay = document.getElementById("questionsOverlay");

    // Variables de control de estado
    let isProcessing = false;
    let lastProcessedQuestion = null;
    let loadingMessageId = null;

    // --- LÓGICA DE UI (SIDEBAR & MOBILE) ---

    const ensureSidebarPosition = () => {
        if (window.innerWidth <= 1024 && questionsSidebar) {
            if (questionsSidebar.parentElement !== document.body) {
                document.body.appendChild(questionsSidebar);
                if (questionsOverlay) document.body.appendChild(questionsOverlay);
            }
        }
    };

    const openQuestionsSidebar = () => {
        ensureSidebarPosition();
        questionsSidebar.style.display = "flex";
        questionsSidebar.style.visibility = "visible";
        questionsSidebar.classList.add("active");
        
        if (window.innerWidth <= 1024) {
            questionsSidebar.style.setProperty("left", "0", "important");
        }
        
        if (questionsOverlay) questionsOverlay.classList.add("active");
        if (closeQuestionsBtn) {
            closeQuestionsBtn.style.display = "flex";
            closeQuestionsBtn.style.opacity = "1";
        }
        document.body.style.overflow = "hidden";
        questionsToggle?.setAttribute("aria-expanded", "true");
    };

    const closeQuestionsSidebar = () => {
        if (window.innerWidth <= 1024) {
            questionsSidebar.style.left = "-100%";
        }
        questionsSidebar.classList.remove("active");
        questionsOverlay?.classList.remove("active");
        if (closeQuestionsBtn) closeQuestionsBtn.style.display = "none";
        questionsToggle?.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
    };

    // Inicializar Sidebar
    if (questionsToggle && questionsSidebar) {
        // Usar .onclick para asegurar un único listener
        questionsToggle.onclick = (e) => {
            e.preventDefault();
            const isActive = questionsSidebar.classList.contains("active");
            isActive ? closeQuestionsSidebar() : openQuestionsSidebar();
        };

        if (closeQuestionsBtn) closeQuestionsBtn.onclick = closeQuestionsSidebar;
        if (questionsOverlay) questionsOverlay.onclick = closeQuestionsSidebar;
    }

    // --- LÓGICA DEL CHAT ---

    function addMessage(sender, text, messageId = null) {
        const div = document.createElement("div");
        div.className = sender === "bot" ? "bot-msg" : "user-msg";
        div.textContent = text;
        if (messageId) div.setAttribute("data-message-id", messageId);
        chatBox.appendChild(div);
        chatBox.scrollTop = chatBox.scrollHeight;
        return div;
    }

    function showLoadingIndicator() {
        if (loadingMessageId) return;
        loadingMessageId = "loading-" + Date.now();
        addMessage("bot", "Escribiendo...", loadingMessageId);
    }

    function hideLoadingIndicator() {
        if (loadingMessageId) {
            const el = chatBox.querySelector(`[data-message-id="${loadingMessageId}"]`);
            el?.remove();
            loadingMessageId = null;
        }
    }

    function encontrarRespuestaInteligente(pregunta) {
        const pLower = pregunta.toLowerCase().trim();
        const respuestas = CONFIG.CHATBOT.DEFAULT_RESPONSES;
        
        // Coincidencia exacta
        if (respuestas[pregunta]) return respuestas[pregunta];
        
        // Búsqueda por palabras clave
        for (const group of CONFIG.CHATBOT.KEYWORD_RESPONSES) {
            if (group.keywords.some(k => pLower.includes(k.toLowerCase()))) {
                return group.response;
            }
        }
        
        const fallbacks = CONFIG.CHATBOT.DEFAULT_FALLBACK;
        return fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }

    async function procesarRespuesta(pregunta) {
        const pNorm = pregunta.toLowerCase().trim();
        
        // Bloqueo de réplicas
        if (isProcessing || lastProcessedQuestion === pNorm) return null;

        isProcessing = true;
        lastProcessedQuestion = pNorm;
        showLoadingIndicator();

        const delay = Math.random() * 800 + 500;

        return new Promise((resolve) => {
            setTimeout(() => {
                const respuesta = encontrarRespuestaInteligente(pregunta);
                hideLoadingIndicator();
                isProcessing = false;
                // Permitir repetir la misma pregunta tras 2 segundos
                setTimeout(() => { lastProcessedQuestion = null; }, 2000);
                resolve(respuesta);
            }, delay);
        });
    }

    // --- MANEJO DE EVENTOS DE ENTRADA ---

    const handleInteraction = async (texto) => {
        if (!texto || isProcessing) return;
        
        addMessage("user", texto);
        input.value = ""; // Limpiar inmediatamente
        
        const respuesta = await procesarRespuesta(texto);
        if (respuesta) addMessage("bot", respuesta);
    };

    // Preguntas sugeridas
    questionButtons.forEach(btn => {
        btn.onclick = () => {
            const pregunta = btn.getAttribute("data-question");
            if (window.innerWidth <= 1024) closeQuestionsSidebar();
            handleInteraction(pregunta);
        };
    });

    // Envío manual
    sendBtn.onclick = () => handleInteraction(input.value.trim());
    
    input.onkeypress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleInteraction(input.value.trim());
        }
    };

    // Mensaje de bienvenida inicial
    chatBox.innerHTML = "";
    addMessage("bot", "¡Hola! Soy el asistente de Christopher. ¿En qué puedo ayudarte hoy?");
}