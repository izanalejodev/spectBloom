<?php
// app/Services/OllamaService.php

namespace App\Services;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Support\Facades\Log;

class OllamaService
{
    protected $client;
    protected $baseUrl;
    
    public function __construct()
    {
        $this->client = new Client([
            'timeout' => 300, // 5 minutes
            'connect_timeout' => 10,
        ]);
        
        $this->baseUrl = config('ollama.base_url', 'http://localhost:11434');
    }
    
    /**
     * Generate text using specified model
     */
    public function generate(string $model, string $prompt, array $options = []): array
    {
        try {
            $response = $this->client->post($this->baseUrl . '/api/generate', [
                'json' => [
                    'model' => $model,
                    'prompt' => $prompt,
                    'stream' => false,
                    'options' => $options
                ],
                'headers' => [
                    'Content-Type' => 'application/json',
                ]
            ]);
            
            $body = json_decode($response->getBody()->getContents(), true);
            
            return [
                'success' => true,
                'response' => $body['response'] ?? '',
                'model' => $body['model'] ?? $model,
                'total_duration' => $body['total_duration'] ?? 0,
            ];
            
        } catch (RequestException $e) {
            Log::error('Ollama API Error: ' . $e->getMessage());
            
            return [
                'success' => false,
                'error' => 'Failed to generate response: ' . $e->getMessage(),
                'response' => '',
            ];
        }
    }
    
    /**
     * Stream responses for real-time interaction
     */
    public function generateStream(string $model, string $prompt, callable $callback = null): \Generator
    {
        try {
            $response = $this->client->post($this->baseUrl . '/api/generate', [
                'json' => [
                    'model' => $model,
                    'prompt' => $prompt,
                    'stream' => true,
                ],
                'stream' => true,
            ]);
            
            $body = $response->getBody();
            
            while (!$body->eof()) {
                $line = $body->read(1024);
                if (!empty($line)) {
                    $data = json_decode($line, true);
                    if ($data && isset($data['response'])) {
                        if ($callback) {
                            $callback($data['response']);
                        }
                        yield $data['response'];
                    }
                }
            }
            
        } catch (RequestException $e) {
            Log::error('Ollama Streaming Error: ' . $e->getMessage());
            yield 'Error: ' . $e->getMessage();
        }
    }
    
    /**
     * Get available models
     */
    public function getModels(): array
    {
        try {
            $response = $this->client->get($this->baseUrl . '/api/tags');
            $body = json_decode($response->getBody()->getContents(), true);
            
            return $body['models'] ?? [];
            
        } catch (RequestException $e) {
            Log::error('Failed to fetch models: ' . $e->getMessage());
            return [];
        }
    }
    
    /**
     * Check if Ollama service is running
     */
    public function isHealthy(): bool
    {
        try {
            $response = $this->client->get($this->baseUrl . '/api/tags', [
                'timeout' => 5,
            ]);
            
            return $response->getStatusCode() === 200;
            
        } catch (RequestException $e) {
            return false;
        }
    }
}