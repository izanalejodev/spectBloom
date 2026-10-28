<?php
// config/ollama.php

return [
    'base_url' => env('OLLAMA_BASE_URL', 'http://localhost:11434'),
    'default_model' => env('OLLAMA_DEFAULT_MODEL', 'llama2'),
    'timeout' => env('OLLAMA_TIMEOUT', 120),
    'max_tokens' => env('OLLAMA_MAX_TOKENS', 2048),
    'temperature' => env('OLLAMA_TEMPERATURE', 0.7),
];
