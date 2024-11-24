const chatContainer = document.getElementById('chat-container');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const themeToggle = document.getElementById('theme-toggle');
const clearChatButton = document.getElementById('clear-chat');
const maxTokensInput = document.getElementById('max-tokens');
const temperatureInput = document.getElementById('temperature');
const modelSelect = document.getElementById('model-select');
const apiProviderSelect = document.getElementById('api-provider-select');
const settingsButton = document.getElementById('settingsButton');
let chatHistory = [];

// Função para carregar as opções do seletor de modelo com base no provedor de API selecionado
function loadModelOptions() {
    const selectedProvider = apiProviderSelect.value;
    const modelOptions = {
        'openai': [
            { value: 'gpt-4o-mini', label: 'gpt-4o-mini' },
            { value: 'gpt-4-turbo', label: 'gpt-4-turbo' },
            { value: 'gpt-4', label: 'gpt-4' },
            { value: 'gpt-3.5-turbo-0125', label: 'gpt-3.5-turbo-0125' },
            { value: 'gpt-3.5-turbo', label: 'gpt-3.5-turbo' },
            { value: 'o1-preview', label: 'o1-preview' },
        ],
        'gemini': [
            { value: 'gemini-1.5-flash', label: 'gemini-1.5-flash' },
            { value: 'gemini-1.5-pro', label: 'gemini-1.5-pro' },
            { value: 'gemini-1.0-pro', label: 'gemini-1.0-pro' },
            { value: 'text-embedding-004', label: 'text-embedding-004' }
        ],
        'perplexity': [
            { value: 'llama-3.1-sonar-small-128k-online', label: 'llama-3.1-sonar-small-128k-online' },
            { value: 'llama-3.1-sonar-large-128k-online', label: 'llama-3.1-sonar-large-128k-online' },
            { value: 'llama-3.1-sonar-huge-128k-online', label: 'llama-3.1-sonar-huge-128k-online' },
            { value: 'llama-3.1-sonar-small-128k-chat', label: 'llama-3.1-sonar-small-128k-chat' },
            { value: 'llama-3.1-sonar-large-128k-chat', label: 'llama-3.1-sonar-large-128k-chat' },
            { value: 'llama-3.1-8b-instruct', label: 'llama-3.1-8b-instruct' },
            { value: 'llama-3.1-70b-instruct', label: 'llama-3.1-70b-instruct' }
        ]
    };

    modelSelect.innerHTML = '';
    modelOptions[selectedProvider].forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = option.label;
        modelSelect.appendChild(optionElement);
    });
}

function addMessage(message, isUser = false) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', 'transition-all', isUser ? 'user-message' : 'assistant-message');

    const avatar = document.createElement('img');
    avatar.classList.add('avatar', isUser ? 'user-avatar' : 'assistant-avatar');
    avatar.src = `static/img/${isUser ? 'user' : 'assistant'}-avatar.png`;
    avatar.alt = `Avatar do ${isUser ? 'Usuário' : 'Assistente'}`;
    messageElement.appendChild(avatar);

    const messageContent = document.createElement('div');
    messageContent.innerHTML = marked.parse(message);
    messageElement.appendChild(messageContent);

    messageElement.querySelectorAll('pre').forEach(pre => {
        const copyButton = document.createElement('button');
        copyButton.textContent = 'Copiar';
        copyButton.classList.add('copy-button');
        copyButton.addEventListener('click', () => {
            navigator.clipboard.writeText(pre.textContent);
            copyButton.textContent = 'Copiado!';
            setTimeout(() => copyButton.textContent = 'Copiar', 2000);
        });
        pre.appendChild(copyButton);
    });

    chatContainer.appendChild(messageElement);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    chatHistory.push({ role: isUser ? 'user' : 'assistant', content: message });
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));

    messageElement.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block);
    });
}

async function sendMessage() {
    const message = userInput.value.trim();
    if (message === '') return;

    addMessage(message, true);
    userInput.value = '';
    userInput.style.height = 'auto';

    try {
        const response = await fetch('/ask', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message,
                max_tokens: parseInt(maxTokensInput.value),
                temperature: parseFloat(temperatureInput.value),
                model: modelSelect.value,
                api_provider: apiProviderSelect.value,
                top_p: parseFloat(document.getElementById('top-p').value),
                frequency_penalty: parseFloat(document.getElementById('frequency-penalty').value),
                presence_penalty: parseFloat(document.getElementById('presence-penalty').value)
            })
        });

        const data = await response.json();
        addMessage(data.response || 'Desculpe, ocorreu um erro ao processar sua solicitação.');
    } catch (error) {
        addMessage('Erro ao se comunicar com o servidor.');
    }
}

function exportConversation(format) {
    const messages = chatContainer.querySelectorAll('.message');
    let conversation = Array.from(messages).reduce((acc, message) => {
        const isUser = message.classList.contains('user-message');
        const messageContent = message.querySelector('div').textContent.trim();
        return acc + `${isUser ? 'Usuário' : 'Assistente'}: ${messageContent}\n\n`;
    }, '');

    const mimeType = {
        'txt': 'text/plain',
        'md': 'text/markdown',
        'pdf': 'application/pdf',
        'doc': 'application/msword'
    }[format] || 'text/plain';  // Default para text/plain

    const blob = new Blob([conversation], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conversation.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Event Listeners
apiProviderSelect.addEventListener('change', loadModelOptions);
sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
});
userInput.addEventListener('input', () => {
    userInput.style.height = 'auto';
    userInput.style.height = (userInput.scrollHeight) + 'px';
});

// Modal e Exportação
const myModal = new bootstrap.Modal(document.getElementById('settingsModal'));
settingsButton.addEventListener('click', () => myModal.show());

document.querySelectorAll('.dropdown-menu .dropdown-item').forEach(button => {
    button.addEventListener('click', (event) => {
        const format = button.getAttribute('data-format');
        exportConversation(format);
        setTimeout(() => {
            bootstrap.Dropdown.getInstance(event.target.closest('.dropdown-toggle')).hide();
        }, 200);
    });
});

// Inicialização
loadModelOptions();