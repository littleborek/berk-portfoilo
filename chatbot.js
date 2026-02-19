/* ==============================================
   CHATBOT — AI Asistan
   ============================================== */

(function () {
    const CHAT_API = '/api/chat';
    const RELAY_API = '/api/relay';
    const MAX_MESSAGES = 20;

    let chatHistory = [];
    let messageCount = 0;
    let isOpen = false;
    let isWaiting = false;

    /* ---------- Translations ---------- */
    const chatTranslations = {
        tr: {
            title: 'AI Asistan',
            welcome: 'Merhaba! 👋 Ben Berk\'in AI asistanıyım. Berk hakkında veya projeleri hakkında sorularınızı yanıtlayabilirim.',
            placeholder: 'Bir soru sorun...',
            relaySuccess: '✅ Mesajınız Berk\'e iletildi!',
            relayFail: '❌ Mesaj iletilemedi, lütfen tekrar deneyin.',
            error: 'Bir hata oluştu, lütfen tekrar deneyin.',
            rateLimit: '⏳ API limiti aşıldı, lütfen biraz bekleyip tekrar deneyin.',
            limitReached: 'Mesaj limitine ulaştınız. Sayfayı yenileyerek yeni bir sohbet başlatabilirsiniz.',
            chip1: 'Berk kimdir?',
            chip2: 'Projeleri neler?',
            chip3: 'İletişime geç',
            cvDownloading: '📄 CV indiriliyor...',
            searchingProjects: '🔍 Projeler aranıyor...',
            projectsFound: '✅ Eşleşen projeler vurgulandı!',
            projectsNotFound: 'Bu konuda proje bulunamadı, tüm projelere göz atabilirsin.',
        },
        en: {
            title: 'AI Assistant',
            welcome: 'Hello! 👋 I\'m Berk\'s AI assistant. Feel free to ask me anything about Berk or his projects.',
            placeholder: 'Ask a question...',
            relaySuccess: '✅ Your message has been relayed to Berk!',
            relayFail: '❌ Could not relay message, please try again.',
            error: 'An error occurred, please try again.',
            rateLimit: '⏳ API rate limit exceeded, please wait a moment and try again.',
            limitReached: 'Message limit reached. Refresh the page to start a new chat.',
            chip1: 'Who is Berk?',
            chip2: 'What are his projects?',
            chip3: 'Get in touch',
            cvDownloading: '📄 Downloading CV...',
            searchingProjects: '🔍 Searching projects...',
            projectsFound: '✅ Matching projects highlighted!',
            projectsNotFound: 'No projects found for this topic, check out all projects.',
        },
    };

    function getLang() {
        try {
            return localStorage.getItem('language') || 'tr';
        } catch (e) {
            return 'tr';
        }
    }

    function t(key) {
        const lang = getLang();
        return chatTranslations[lang]?.[key] || chatTranslations.tr[key] || key;
    }

    /* ---------- DOM Creation ---------- */
    function createChatbotDOM() {
        // Floating bubble button
        const bubble = document.createElement('button');
        bubble.id = 'chatbot-bubble';
        bubble.className = 'chatbot-bubble';
        bubble.setAttribute('aria-label', 'AI Chatbot');
        bubble.innerHTML = `
      <svg id="chatbot-icon-open" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
      <svg id="chatbot-icon-close" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:none;">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    `;

        // Chat window
        const chatWindow = document.createElement('div');
        chatWindow.id = 'chatbot-window';
        chatWindow.className = 'chatbot-window';
        chatWindow.innerHTML = `
      <div class="chatbot-header">
        <div class="chatbot-header-info">
          <div class="chatbot-avatar">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 8V4H8"></path>
              <rect width="16" height="12" x="4" y="8" rx="2"></rect>
              <path d="M2 14h2"></path>
              <path d="M20 14h2"></path>
              <path d="M15 13v2"></path>
              <path d="M9 13v2"></path>
            </svg>
          </div>
          <div>
            <span class="chatbot-title" id="chatbot-title">${t('title')}</span>
            <span class="chatbot-status">Online</span>
          </div>
        </div>
        <button id="chatbot-close" class="chatbot-close-btn" aria-label="Close chat">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div class="chatbot-messages" id="chatbot-messages"></div>
      <div class="chatbot-chips" id="chatbot-chips"></div>
      <div class="chatbot-input-area">
        <input type="text" id="chatbot-input" class="chatbot-input" placeholder="${t('placeholder')}" autocomplete="off" maxlength="500" />
        <button id="chatbot-send" class="chatbot-send-btn" aria-label="Send message" disabled>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
    `;

        document.body.appendChild(bubble);
        document.body.appendChild(chatWindow);

        return { bubble, chatWindow };
    }

    /* ---------- Markdown-ish formatting ---------- */
    function formatReply(text) {
        let html = text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        // Bold
        html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        // Italic
        html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
        // Inline code
        html = html.replace(/`(.+?)`/g, '<code>$1</code>');
        // Links
        html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
        // Line breaks
        html = html.replace(/\n/g, '<br>');

        return html;
    }

    /* ---------- Message rendering ---------- */
    function addMessage(role, text, options = {}) {
        const messagesContainer = document.getElementById('chatbot-messages');
        if (!messagesContainer) return;

        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-message chat-message-${role}`;

        if (role === 'bot') {
            msgDiv.innerHTML = `
        <div class="chat-msg-avatar">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 8V4H8"></path>
            <rect width="16" height="12" x="4" y="8" rx="2"></rect>
            <path d="M2 14h2"></path>
            <path d="M20 14h2"></path>
            <path d="M15 13v2"></path>
            <path d="M9 13v2"></path>
          </svg>
        </div>
        <div class="chat-msg-content">${formatReply(text)}</div>
      `;
        } else if (role === 'user') {
            msgDiv.innerHTML = `<div class="chat-msg-content">${text.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>`;
        } else if (role === 'system') {
            msgDiv.className = 'chat-message chat-message-system';
            msgDiv.innerHTML = `<div class="chat-msg-content">${text}</div>`;
        }

        if (options.animate) {
            msgDiv.style.opacity = '0';
            msgDiv.style.transform = 'translateY(10px)';
            messagesContainer.appendChild(msgDiv);
            requestAnimationFrame(() => {
                msgDiv.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                msgDiv.style.opacity = '1';
                msgDiv.style.transform = 'translateY(0)';
            });
        } else {
            messagesContainer.appendChild(msgDiv);
        }

        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function showTypingIndicator() {
        const messagesContainer = document.getElementById('chatbot-messages');
        if (!messagesContainer) return;

        const typingDiv = document.createElement('div');
        typingDiv.id = 'chatbot-typing';
        typingDiv.className = 'chat-message chat-message-bot';
        typingDiv.innerHTML = `
      <div class="chat-msg-avatar">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 8V4H8"></path>
          <rect width="16" height="12" x="4" y="8" rx="2"></rect>
          <path d="M2 14h2"></path>
          <path d="M20 14h2"></path>
          <path d="M15 13v2"></path>
          <path d="M9 13v2"></path>
        </svg>
      </div>
      <div class="chat-msg-content typing-indicator">
        <span></span><span></span><span></span>
      </div>
    `;
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function hideTypingIndicator() {
        const el = document.getElementById('chatbot-typing');
        if (el) el.remove();
    }

    /* ---------- Quick action chips ---------- */
    function renderChips() {
        const chipsContainer = document.getElementById('chatbot-chips');
        if (!chipsContainer) return;

        chipsContainer.innerHTML = '';
        const chips = [
            { key: 'chip1', text: t('chip1') },
            { key: 'chip2', text: t('chip2') },
            { key: 'chip3', text: t('chip3') },
        ];

        chips.forEach((chip) => {
            const btn = document.createElement('button');
            btn.className = 'chatbot-chip';
            btn.textContent = chip.text;
            btn.addEventListener('click', () => {
                sendMessage(chip.text);
                chipsContainer.style.display = 'none';
            });
            chipsContainer.appendChild(btn);
        });
    }

    /* ---------- API Communication ---------- */
    async function sendMessage(text) {
        if (isWaiting || !text.trim()) return;

        if (messageCount >= MAX_MESSAGES) {
            addMessage('system', t('limitReached'), { animate: true });
            return;
        }

        const chipsContainer = document.getElementById('chatbot-chips');
        if (chipsContainer) chipsContainer.style.display = 'none';

        addMessage('user', text, { animate: true });
        messageCount++;

        chatHistory.push({ role: 'user', text });

        isWaiting = true;
        updateSendButton();
        showTypingIndicator();

        try {
            const response = await fetch(CHAT_API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: text,
                    history: chatHistory.slice(0, -1),
                    lang: getLang(),
                }),
            });

            hideTypingIndicator();

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                if (response.status === 429 || errorData.error === 'rate_limit') {
                    throw new Error('rate_limit');
                }
                throw new Error(errorData.error || 'Request failed');
            }

            const data = await response.json();
            const reply = data.reply || '';

            chatHistory.push({ role: 'model', text: reply });
            addMessage('bot', reply, { animate: true });

            // Execute agentic actions
            if (data.actions && data.actions.length > 0) {
                executeActions(data.actions);
            }

            if (data.relay) {
                await relayMessage(text);
            }
        } catch (error) {
            hideTypingIndicator();
            console.error('Chatbot error:', error);
            const errorMsg = error.message === 'rate_limit' ? t('rateLimit') : t('error');
            addMessage('system', errorMsg, { animate: true });
        } finally {
            isWaiting = false;
            updateSendButton();
        }
    }

    async function relayMessage(originalMessage) {
        try {
            const response = await fetch(RELAY_API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: originalMessage,
                    chatHistory: chatHistory.slice(-6),
                }),
            });

            if (response.ok) {
                addMessage('system', t('relaySuccess'), { animate: true });
            } else {
                throw new Error('Relay failed');
            }
        } catch (error) {
            console.error('Relay error:', error);
            addMessage('system', t('relayFail'), { animate: true });
        }
    }

    /* ---------- Agentic Actions ---------- */
    function executeActions(actions) {
        for (const action of actions) {
            switch (action.type) {
                case 'download_cv':
                    handleDownloadCV();
                    break;
                case 'search_projects':
                    handleSearchProjects(action.payload || '');
                    break;
            }
        }
    }

    function handleDownloadCV() {
        addMessage('system', t('cvDownloading'), { animate: true });
        setTimeout(() => {
            const link = document.createElement('a');
            link.href = '/cv.pdf';
            link.download = 'Berk_Kocaborek_CV.pdf';
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }, 500);
    }

    function handleSearchProjects(keyword) {
        if (!keyword) return;

        addMessage('system', t('searchingProjects'), { animate: true });

        setTimeout(() => {
            // Scroll to projects section
            const projectsSection = document.getElementById('projects');
            if (projectsSection) {
                projectsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

            // Search through project cards
            setTimeout(() => {
                const projectCards = document.querySelectorAll('#projects-grid > a, #projects-grid > div:not(#projects-loader)');
                let found = 0;

                projectCards.forEach(card => {
                    card.classList.remove('project-highlight');
                    const cardText = card.textContent.toLowerCase();
                    const desc = card.getAttribute('data-description')?.toLowerCase() || '';
                    const topics = card.getAttribute('data-topics')?.toLowerCase() || '';
                    const searchTerm = keyword.toLowerCase();

                    if (cardText.includes(searchTerm) || desc.includes(searchTerm) || topics.includes(searchTerm)) {
                        card.classList.add('project-highlight');
                        found++;
                    }
                });

                if (found > 0) {
                    addMessage('system', `${t('projectsFound')} (${found})`, { animate: true });
                } else {
                    addMessage('system', t('projectsNotFound'), { animate: true });
                }

                // Remove highlights after 6 seconds
                setTimeout(() => {
                    projectCards.forEach(card => card.classList.remove('project-highlight'));
                }, 6000);
            }, 800);
        }, 500);
    }

    /* ---------- UI Interactions ---------- */
    function toggleChat() {
        const chatWindow = document.getElementById('chatbot-window');
        const iconOpen = document.getElementById('chatbot-icon-open');
        const iconClose = document.getElementById('chatbot-icon-close');

        if (!chatWindow) return;

        isOpen = !isOpen;

        if (isOpen) {
            chatWindow.classList.add('chatbot-window-open');
            iconOpen.style.display = 'none';
            iconClose.style.display = 'block';

            const messagesContainer = document.getElementById('chatbot-messages');
            if (messagesContainer && messagesContainer.children.length === 0) {
                addMessage('bot', t('welcome'), { animate: true });
                renderChips();
            }

            setTimeout(() => {
                const input = document.getElementById('chatbot-input');
                if (input) input.focus();
            }, 300);
        } else {
            chatWindow.classList.remove('chatbot-window-open');
            iconOpen.style.display = 'block';
            iconClose.style.display = 'none';
        }
    }

    function updateSendButton() {
        const sendBtn = document.getElementById('chatbot-send');
        const input = document.getElementById('chatbot-input');
        if (sendBtn && input) {
            sendBtn.disabled = isWaiting || !input.value.trim();
        }
    }

    /* ---------- Language sync ---------- */
    function updateChatLanguage() {
        const titleEl = document.getElementById('chatbot-title');
        const inputEl = document.getElementById('chatbot-input');

        if (titleEl) titleEl.textContent = t('title');
        if (inputEl) inputEl.placeholder = t('placeholder');

        const chipsContainer = document.getElementById('chatbot-chips');
        if (chipsContainer && chipsContainer.style.display !== 'none') {
            renderChips();
        }
    }

    /* ---------- Init ---------- */
    function init() {
        const { bubble } = createChatbotDOM();

        bubble.addEventListener('click', toggleChat);

        document.getElementById('chatbot-close')?.addEventListener('click', toggleChat);

        const input = document.getElementById('chatbot-input');
        const sendBtn = document.getElementById('chatbot-send');

        if (input) {
            input.addEventListener('input', updateSendButton);
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    const text = input.value.trim();
                    if (text && !isWaiting) {
                        input.value = '';
                        updateSendButton();
                        sendMessage(text);
                    }
                }
            });
        }

        if (sendBtn) {
            sendBtn.addEventListener('click', () => {
                const text = input?.value.trim();
                if (text && !isWaiting) {
                    input.value = '';
                    updateSendButton();
                    sendMessage(text);
                }
            });
        }

        // Listen for language changes
        const langTr = document.getElementById('lang-tr');
        const langEn = document.getElementById('lang-en');
        if (langTr) langTr.addEventListener('click', () => setTimeout(updateChatLanguage, 50));
        if (langEn) langEn.addEventListener('click', () => setTimeout(updateChatLanguage, 50));

        // Close on ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isOpen) toggleChat();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
