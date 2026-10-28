{{-- resources/views/ai/chat.blade.php --}}
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Chat Assistant</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 min-h-screen">

<div class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto">
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
            <div class="bg-indigo-500 text-white p-4">
                <h1 class="text-2xl font-bold">🌸 Asistente IA SpectBloom</h1>
                <div class="flex items-center mt-2">
                    <span class="inline-block w-3 h-3 rounded-full mr-2 {{ $isHealthy ? 'bg-green-400' : 'bg-red-400' }}"></span>
                    <span class="text-sm">{{ $isHealthy ? 'Ollama conectado' : 'Ollama desconectado' }}</span>
                </div>
            </div>

            <div class="p-4 border-b">
                <label for="model-select" class="block text-sm font-medium text-gray-700 mb-2">Modelo:</label>
                <select id="model-select" class="w-full md:w-64 p-2 border border-gray-300 rounded-md">
                    @forelse($models as $model)
                        <option value="{{ $model['name'] }}">{{ $model['name'] }}</option>
                    @empty
                        <option value="phi3:mini">phi3:mini</option>
                    @endforelse
                </select>
            </div>

            <div id="chat-messages" class="h-96 overflow-y-auto p-4 space-y-4">
                <div class="flex justify-center">
                    <div class="bg-gray-100 rounded-lg p-3 text-sm text-gray-600">
                        Empieza una conversación con tu asistente IA
                    </div>
                </div>
            </div>

            <div class="p-4 border-t">
                <form id="chat-form" class="flex space-x-2">
                    <input type="text" id="message-input" placeholder="Escribe tu mensaje..."
                        class="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        maxlength="2000">
                    <button type="submit" id="send-button"
                        class="bg-indigo-500 text-white px-6 py-3 rounded-md hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed">
                        Enviar
                    </button>
                </form>
            </div>
        </div>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const chatForm     = document.getElementById('chat-form');
    const messageInput = document.getElementById('message-input');
    const sendButton   = document.getElementById('send-button');
    const chatMessages = document.getElementById('chat-messages');
    const modelSelect  = document.getElementById('model-select');

    function addMessage(content, isUser = false) {
        const div = document.createElement('div');
        div.className = `flex ${isUser ? 'justify-end' : 'justify-start'}`;
        div.innerHTML = `<div class="max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${isUser ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-800'}">${content}</div>`;
        chatMessages.appendChild(div);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    chatForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const message = messageInput.value.trim();
        if (!message) return;
        addMessage(message, true);
        messageInput.value = '';
        sendButton.disabled = true;
        sendButton.textContent = 'Enviando...';
        try {
            // Usamos /api/ai/chat — sin CSRF, funciona desde Blade y desde Angular
            const res = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message, model: modelSelect.value })
            });
            const data = await res.json();
            addMessage(data.success ? data.response : 'Error: ' + (data.error || 'Sin respuesta'));
        } catch {
            addMessage('Error: No se pudo enviar el mensaje');
        } finally {
            sendButton.disabled = false;
            sendButton.textContent = 'Enviar';
        }
    });

    messageInput.addEventListener('keypress', e => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); chatForm.dispatchEvent(new Event('submit')); }
    });
});
</script>
</body>
</html>