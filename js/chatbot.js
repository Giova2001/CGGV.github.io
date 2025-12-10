import { CONFIG } from './config.js';

export function initChatBot() {
    console.log("🤖 Chatbot inicializado!");

    const chatBox = document.querySelector(".chat-box");
    const input = document.getElementById("user-input");
    const sendBtn = document.getElementById("send-btn");
    const questionSelect = document.getElementById("questionSelect");
    const sendSelectBtn = document.getElementById("sendSelectBtn");

    if (!chatBox || !input || !sendBtn || !questionSelect || !sendSelectBtn) {
        console.error("❌ Elementos del chatbot no encontrados");
        return;
    }

    chatBox.innerHTML = "";
    let loadingMessageId = null;
    let isProcessing = false;

    const respuestas = CONFIG.CHATBOT.DEFAULT_RESPONSES;

    addMessage("bot", "👋 Hola, soy una IA entrenada para entrevistas.");
    addMessage("bot", "Selecciona una pregunta del desplegable o escribe tu propia pregunta.");

    function addMessage(sender, text, messageId = null) {
        const div = document.createElement("div");
        div.className = sender === "bot" ? "bot-msg" : "user-msg";
        div.textContent = text;
        if (messageId) div.setAttribute("data-message-id", messageId);
        div.setAttribute("role", sender === "bot" ? "assistant" : "user");
        div.setAttribute("aria-label", sender === "bot" ? "Mensaje del bot" : "Tu mensaje");
        chatBox.appendChild(div);
        chatBox.scrollTop = chatBox.scrollHeight;
        return div;
    }

    function removeMessage(messageId) {
        const message = chatBox.querySelector(`[data-message-id="${messageId}"]`);
        if (message) message.remove();
    }

    function showLoadingIndicator() {
        const loadingDiv = addMessage("bot", "⏳ Escribiendo...", "loading-indicator");
        loadingMessageId = "loading-indicator";
        return loadingDiv;
    }

    function hideLoadingIndicator() {
        if (loadingMessageId) {
            removeMessage(loadingMessageId);
            loadingMessageId = null;
        }
    }

    // --- Función para enviar mensaje a OpenAI ---
    async function enviarAOpenAI(prompt) {
        if (isProcessing) {
            addMessage("bot", "⏳ Por favor espera, estoy procesando tu mensaje anterior...");
            return null;
        }

        isProcessing = true;
        showLoadingIndicator();

        try {
            const apiUrl = `${CONFIG.API.BASE_URL}${CONFIG.API.ENDPOINTS.CHAT}`;
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt })
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            
            if (!data || !data.reply) {
                throw new Error("Respuesta inválida del servidor");
            }

            hideLoadingIndicator();
            isProcessing = false;
            return data.reply;
        } catch (err) {
            hideLoadingIndicator();
            isProcessing = false;
            console.error("Error en chatbot:", err);
            
            // Mensajes de error más específicos
            if (err.message.includes("Failed to fetch") || err.message.includes("NetworkError")) {
                return "❌ Error de conexión. Por favor verifica que el servidor esté funcionando o intenta más tarde.";
            }
            return "❌ Error al obtener respuesta del servidor. Por favor intenta más tarde.";
        }
    }

    // --- Enviar pregunta desde select ---
    sendSelectBtn.addEventListener("click", async () => {
        const pregunta = questionSelect.value.trim();
        if (!pregunta) {
            addMessage("bot", "⚠️ Por favor selecciona una pregunta del menú.");
            return;
        }

        addMessage("user", pregunta);
        questionSelect.selectedIndex = 0;

        if (respuestas[pregunta]) {
            // Pequeño delay para mejor UX
            setTimeout(() => {
                addMessage("bot", respuestas[pregunta]);
            }, 300);
        } else {
            const respuesta = await enviarAOpenAI(pregunta);
            if (respuesta) {
                addMessage("bot", respuesta);
            }
        }
    });

    // --- Enviar pregunta manual ---
    sendBtn.addEventListener("click", sendQuestion);
    input.addEventListener("keypress", (e) => { 
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendQuestion();
        }
    });

    async function sendQuestion() {
        const userText = input.value.trim();
        if (!userText) {
            addMessage("bot", "⚠️ Por favor escribe una pregunta.");
            return;
        }

        if (userText.length > 500) {
            addMessage("bot", "⚠️ Tu mensaje es demasiado largo. Por favor limítalo a 500 caracteres.");
            return;
        }

        addMessage("user", userText);
        input.value = "";
        sendBtn.disabled = true;
        sendBtn.setAttribute("aria-busy", "true");

        if (respuestas[userText]) {
            setTimeout(() => {
                addMessage("bot", respuestas[userText]);
                sendBtn.disabled = false;
                sendBtn.removeAttribute("aria-busy");
            }, 300);
        } else {
            const respuesta = await enviarAOpenAI(userText);
            if (respuesta) {
                addMessage("bot", respuesta);
            }
            sendBtn.disabled = false;
            sendBtn.removeAttribute("aria-busy");
        }
    }
}
