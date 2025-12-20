import { CONFIG } from './config.js';

export function initChatBot() {
    console.log("Chatbot inicializado!");

    const chatBox = document.querySelector(".chat-box");
    const input = document.getElementById("user-input");
    const sendBtn = document.getElementById("send-btn");
    const questionButtons = document.querySelectorAll(".question-btn");
    
    // Inicializar toggle de preguntas con slideout (antes de verificar otros elementos)
    const questionsToggle = document.getElementById("questionsToggle");
    const questionsSidebar = document.querySelector(".questions-sidebar");
    const closeQuestionsBtn = document.getElementById("closeQuestionsBtn");
    const questionsOverlay = document.getElementById("questionsOverlay");

    // Declarar funciones fuera del if para que sean accesibles
    let closeQuestionsSidebar = null;
    let openQuestionsSidebar = null;

    if (questionsToggle && questionsSidebar) {
        // Mover el sidebar al body para que se sobreponga correctamente (solo en móvil)
        function ensureSidebarPosition() {
            if (window.innerWidth <= 1024) {
                // Si no está ya en el body, moverlo
                if (questionsSidebar.parentElement !== document.body) {
                    document.body.appendChild(questionsSidebar);
                    console.log("📦 Sidebar movido al body para sobreponerse");
                }
                // También mover el overlay al body si existe
                if (questionsOverlay && questionsOverlay.parentElement !== document.body) {
                    document.body.appendChild(questionsOverlay);
                }
            }
        }

        openQuestionsSidebar = function() {
            console.log("Abriendo sidebar...");
            
            ensureSidebarPosition(); // Asegurar posición antes de abrir
            
            // Asegurar que el sidebar esté visible
            questionsSidebar.style.display = "flex";
            questionsSidebar.style.visibility = "visible";
            
            // Forzar left: 0 directamente desde JavaScript para asegurar que funcione
            if (window.innerWidth <= 1024) {
                questionsSidebar.style.left = "0";
                // Usar setTimeout para asegurar que se aplique después de cualquier otro código
                setTimeout(() => {
                    questionsSidebar.style.left = "0";
                    console.log("Left confirmado después de timeout:", questionsSidebar.style.left);
                }, 10);
            }
            
            questionsSidebar.classList.add("active");
            
            if (questionsOverlay) {
                questionsOverlay.classList.add("active");
            }
            if (closeQuestionsBtn) {
                closeQuestionsBtn.style.display = "flex";
                closeQuestionsBtn.style.visibility = "visible";
                closeQuestionsBtn.style.opacity = "1";
                // X negra simple - posición y estilo
                closeQuestionsBtn.style.left = window.innerWidth <= 480 ? "245px" : "250px";
                closeQuestionsBtn.style.top = window.innerWidth <= 480 ? "12px" : "15px";
                closeQuestionsBtn.style.fontSize = window.innerWidth <= 480 ? "28px" : "32px";
                closeQuestionsBtn.style.background = "transparent";
                closeQuestionsBtn.style.color = "#000";
                closeQuestionsBtn.style.border = "none";
                closeQuestionsBtn.style.width = "auto";
                closeQuestionsBtn.style.height = "auto";
                closeQuestionsBtn.style.padding = "5px";
                console.log("Botón cerrar mostrado (X negra)");
            }
            if (questionsToggle) {
                questionsToggle.setAttribute("aria-expanded", "true");
            }
            document.body.style.overflow = "hidden";
            
            // Verificar después de un breve delay y forzar si es necesario
            setTimeout(() => {
                const computedLeft = window.getComputedStyle(questionsSidebar).left;
                console.log("Verificación final - left del sidebar:", computedLeft);
                console.log("Verificación final - inline style:", questionsSidebar.style.left);
                if (computedLeft !== "0px" && computedLeft !== "0") {
                    console.warn("Left no está en 0, forzando con setProperty...");
                    questionsSidebar.style.setProperty("left", "0", "important");
                    console.log("Left forzado con important:", window.getComputedStyle(questionsSidebar).left);
                }
            }, 50);
            
            console.log("Sidebar abierto, left aplicado:", questionsSidebar.style.left);
        };

        closeQuestionsSidebar = function() {
            console.log("Cerrando sidebar...");
            
            // Forzar left: -100% directamente desde JavaScript
            if (window.innerWidth <= 1024) {
                questionsSidebar.style.left = "-100%";
            }
            
            questionsSidebar.classList.remove("active");
            if (questionsOverlay) questionsOverlay.classList.remove("active");
            if (closeQuestionsBtn) closeQuestionsBtn.style.display = "none";
            if (questionsToggle) {
                questionsToggle.setAttribute("aria-expanded", "false");
            }
            document.body.style.overflow = "";
            console.log("Sidebar cerrado");
        };

        function updateToggleState() {
            const isMobile = window.innerWidth <= 1024;
            const isActive = questionsSidebar.classList.contains("active");
            console.log(`📱 Tamaño de pantalla: ${window.innerWidth}px, es móvil: ${isMobile}, sidebar activo: ${isActive}`);
            
            if (isMobile) {
                // En móvil, sidebar oculto inicialmente, mostrar botón externo
                // Solo limpiar left si el sidebar NO está activo
                if (!isActive) {
                    questionsSidebar.classList.remove("active");
                    questionsSidebar.style.left = "-100%"; // Asegurar que esté oculto
                    if (questionsOverlay) questionsOverlay.classList.remove("active");
                    if (closeQuestionsBtn) closeQuestionsBtn.style.display = "none";
                    if (questionsToggle) questionsToggle.style.display = "flex";
                    document.body.style.overflow = "";
                    console.log("Modo móvil: sidebar oculto, botón visible");
                } else {
                    // Si está activo, solo asegurar que el botón esté visible
                    if (questionsToggle) questionsToggle.style.display = "flex";
                    console.log("Modo móvil: sidebar activo, no modificar estado");
                }
            } else {
                // En desktop, mostrar sidebar siempre y ocultar toggle
                questionsSidebar.classList.remove("active");
                questionsSidebar.style.left = ""; // Limpiar estilos inline
                questionsSidebar.style.position = "";
                questionsSidebar.style.width = "";
                questionsSidebar.style.minWidth = "";
                questionsSidebar.style.height = "";
                questionsSidebar.style.minHeight = "";
                questionsSidebar.style.borderRadius = "";
                questionsSidebar.style.borderRight = "";
                if (questionsOverlay) questionsOverlay.classList.remove("active");
                if (closeQuestionsBtn) closeQuestionsBtn.style.display = "none";
                if (questionsToggle) questionsToggle.style.display = "none";
                document.body.style.overflow = "";
                console.log("Modo desktop: sidebar siempre visible");
            }
        }

        // Inicializar estado
        ensureSidebarPosition(); // Asegurar posición inicial
        updateToggleState();

        // Prevenir múltiples event listeners
        let toggleHandlerAdded = false;
        
        // Manejar clic en el botón toggle
        if (!toggleHandlerAdded) {
            questionsToggle.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // Prevenir clics rápidos múltiples
                if (questionsToggle.hasAttribute('data-processing')) {
                    return;
                }
                
                questionsToggle.setAttribute('data-processing', 'true');
                setTimeout(() => {
                    questionsToggle.removeAttribute('data-processing');
                }, 300);
                
                console.log("Click en toggle, ancho actual:", window.innerWidth);
                
                if (window.innerWidth <= 1024) {
                    if (!questionsSidebar) {
                        console.error("Sidebar no encontrado!");
                        return;
                    }
                    
                    const isActive = questionsSidebar.classList.contains("active");
                    console.log(`Estado actual del sidebar: ${isActive ? 'abierto' : 'cerrado'}`);
                    
                    if (isActive) {
                        console.log("Cerrando sidebar...");
                        if (typeof closeQuestionsSidebar === 'function') {
                            closeQuestionsSidebar();
                        }
                    } else {
                        console.log("Abriendo sidebar...");
                        if (typeof openQuestionsSidebar === 'function') {
                            openQuestionsSidebar();
                        }
                    }
                } else {
                    console.log("Modo desktop, no se puede abrir/cerrar");
                }
            });
            toggleHandlerAdded = true;
        }

        // Manejar clic en botón cerrar
        if (closeQuestionsBtn) {
            closeQuestionsBtn.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                closeQuestionsSidebar();
            });
        }

        // Cerrar al hacer clic en overlay (solo si se hace clic directamente en el overlay)
        if (questionsOverlay) {
            questionsOverlay.addEventListener("click", (e) => {
                e.stopPropagation(); // Prevenir que el clic se propague
                // Solo cerrar si se hace clic directamente en el overlay
                if (e.target === questionsOverlay && !questionsSidebar.contains(e.target)) {
                    console.log("Click en overlay, cerrando sidebar");
                    closeQuestionsSidebar();
                }
            });
        }
        
        // Prevenir que los clics en el sidebar cierren el overlay
        if (questionsSidebar) {
            questionsSidebar.addEventListener("click", (e) => {
                e.stopPropagation(); // Prevenir que el clic se propague al overlay
            });
        }

        // Cerrar con tecla Escape
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && questionsSidebar.classList.contains("active")) {
                closeQuestionsSidebar();
            }
        });

        // Ajustar al cambiar tamaño de ventana
        let resizeTimeout;
        window.addEventListener("resize", () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                ensureSidebarPosition(); // Asegurar posición al cambiar tamaño
                updateToggleState();
                // Cerrar sidebar si estaba abierto al cambiar a desktop
                if (window.innerWidth > 1024) {
                    closeQuestionsSidebar();
                }
            }, 250);
        });
    } else {
        console.warn("questionsToggle o questionsSidebar no encontrados");
    }

    chatBox.innerHTML = "";
    let loadingMessageId = null;
    let isProcessing = false;
    let lastProcessedQuestion = null; // Evitar procesar la misma pregunta dos veces seguidas

    const respuestas = CONFIG.CHATBOT.DEFAULT_RESPONSES;
    const keywordResponses = CONFIG.CHATBOT.KEYWORD_RESPONSES;
    const fallbackResponses = CONFIG.CHATBOT.DEFAULT_FALLBACK;

    addMessage("bot", "Hola, soy un asistente virtual para responder preguntas sobre Christopher.");
    addMessage("bot", "Puedes seleccionar una pregunta del menú o escribir tu propia pregunta. Estoy aquí para ayudarte a conocer más sobre su experiencia y habilidades.");

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
        const loadingDiv = addMessage("bot", "Escribiendo...", "loading-indicator");
        loadingMessageId = "loading-indicator";
        return loadingDiv;
    }

    function hideLoadingIndicator() {
        if (loadingMessageId) {
            removeMessage(loadingMessageId);
            loadingMessageId = null;
        }
    }

    // --- Función inteligente para encontrar respuesta basada en palabras clave ---
    function encontrarRespuestaInteligente(pregunta) {
        const preguntaLower = pregunta.toLowerCase().trim();
        
        // 1. Verificar respuestas exactas primero
        if (respuestas[pregunta]) {
            return respuestas[pregunta];
        }
        
        // 2. Verificar respuestas exactas sin case sensitivity
        for (const [key, value] of Object.entries(respuestas)) {
            if (key.toLowerCase() === preguntaLower) {
                return value;
            }
        }
        
        // 3. Buscar por palabras clave
        for (const keywordGroup of keywordResponses) {
            for (const keyword of keywordGroup.keywords) {
                if (preguntaLower.includes(keyword.toLowerCase())) {
                    return keywordGroup.response;
                }
            }
        }
        
        // 4. Si no hay coincidencia, retornar respuesta aleatoria del fallback
        const randomFallback = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
        return randomFallback;
    }

    // --- Función simula procesamiento con delay para mejor UX ---
    async function procesarRespuesta(pregunta) {
        // Normalizar la pregunta para comparación
        const preguntaNormalizada = pregunta.toLowerCase().trim();
        
        // Evitar procesar si ya está procesando o si es la misma pregunta
        if (isProcessing) {
            if (lastProcessedQuestion === preguntaNormalizada) {
                console.log("Ya se está procesando esta pregunta, ignorando...");
                return null;
            }
            addMessage("bot", "Por favor espera, estoy procesando tu mensaje anterior...");
            return null;
        }

        // Verificar si ya se procesó esta pregunta recientemente
        if (lastProcessedQuestion === preguntaNormalizada) {
            console.log("Esta pregunta ya fue procesada, ignorando duplicado...");
            return null;
        }

        isProcessing = true;
        lastProcessedQuestion = preguntaNormalizada;
        showLoadingIndicator();

        // Simular delay de procesamiento (entre 500ms y 1500ms)
        const delay = Math.random() * 1000 + 500;
        
        return new Promise((resolve) => {
            setTimeout(() => {
                const respuesta = encontrarRespuestaInteligente(pregunta);
                hideLoadingIndicator();
                isProcessing = false;
                // Resetear después de un pequeño delay para permitir preguntas repetidas después de un tiempo
                setTimeout(() => {
                    lastProcessedQuestion = null;
                }, 1000);
                resolve(respuesta);
            }, delay);
        });
    }

    // --- Manejar clics en preguntas sugeridas del sidebar ---
    questionButtons.forEach(btn => {
        btn.addEventListener("click", async (e) => {
            // Prevenir múltiples clics
            if (btn.disabled || isProcessing) {
                console.log("Botón deshabilitado o procesando, ignorando clic...");
                return;
            }

            const pregunta = btn.getAttribute("data-question");
        if (!pregunta) return;

            // Deshabilitar el botón mientras se procesa
            btn.disabled = true;
            btn.style.opacity = "0.6";
            btn.style.cursor = "not-allowed";

            // Agregar efecto visual
            btn.style.transform = "scale(0.95)";
            setTimeout(() => {
                btn.style.transform = "";
            }, 150);

            // Cerrar el sidebar al hacer clic en una pregunta (solo en móvil)
            if (window.innerWidth <= 1024) {
                if (typeof closeQuestionsSidebar === 'function') {
                    closeQuestionsSidebar();
                } else if (questionsSidebar) {
                    // Fallback: cerrar directamente si la función no está disponible
                    questionsSidebar.classList.remove("active");
                    if (questionsOverlay) questionsOverlay.classList.remove("active");
                    if (closeQuestionsBtn) closeQuestionsBtn.style.display = "none";
                    document.body.style.overflow = "";
                }
            }

            // Enviar la pregunta
        addMessage("user", pregunta);
            const respuesta = await procesarRespuesta(pregunta);
            if (respuesta) {
            addMessage("bot", respuesta);
        }

            // Rehabilitar el botón después de procesar
            setTimeout(() => {
                btn.disabled = false;
                btn.style.opacity = "1";
                btn.style.cursor = "pointer";
            }, 1000);
        });
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
            addMessage("bot", "Por favor escribe una pregunta.");
            return;
        }

        if (userText.length > 500) {
            addMessage("bot", "Tu mensaje es demasiado largo. Por favor limítalo a 500 caracteres.");
            return;
        }

        addMessage("user", userText);
        input.value = "";
        sendBtn.disabled = true;
        sendBtn.setAttribute("aria-busy", "true");

        const respuesta = await procesarRespuesta(userText);
        if (respuesta) {
            addMessage("bot", respuesta);
        }
        sendBtn.disabled = false;
        sendBtn.removeAttribute("aria-busy");
    }
}
