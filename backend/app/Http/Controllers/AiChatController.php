<?php
// app/Http/Controllers/AiChatController.php

namespace App\Http\Controllers;

use App\Services\OllamaService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class AiChatController extends Controller
{
    protected $ollama;

    public function __construct(OllamaService $ollama)
    {
        $this->ollama = $ollama;
    }


    public function index()
    {
        $models = $this->ollama->getModels();
        $isHealthy = $this->ollama->isHealthy();

        return view('ai.chat', compact('models', 'isHealthy'));
    }
    public function chat(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'message' => 'required|string|max:2000',
            'model' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $message = $request->input('message');
        $model = $request->input('model', config('ollama.default_model'));
        $prompt = "Eres un asistente experto en neurodivergencia, especializado en Trastorno del Espectro Autista (TEA) y Trastorno por Deficit de Atencion e Hiperactividad (TDAH). " .
            "Respondes SIEMPRE en espanol, independientemente del idioma en que te hablen. " .
            "Tu tono es empatico, cercano y comprensible para familias y profesionales. " .
            "Ofreces informacion basada en evidencia cientifica actualizada. " .
            "Cuando no sabes algo, lo dices claramente y sugieres consultar a un profesional. " .
            "Evitas tecnicismos innecesarios pero los explicas cuando los usas. " .
            "Pregunta del usuario: " . $message;

        $result = $this->ollama->generate($model, $prompt, [
            'temperature' => (float) config('ollama.temperature', 0.7),
            'num_predict' => (int) config('ollama.max_tokens', 512),
        ]);


        return response()->json([
            'success' => true,
            'response' => $result['response'] ?? 'Sin contenido en la respuesta'
        ]);
    }


    public function chatStream(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'message' => 'required|string|max:2000',
            'model' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $message = $request->input('message');
        $model = $request->input('model', config('ollama.default_model'));
        $prompt = "You are a helpful AI assistant. Please respond to: " . $message;

        return response()->stream(function () use ($model, $prompt) {
            echo "data: " . json_encode(['type' => 'start']) . "\n\n";

            foreach ($this->ollama->generateStream($model, $prompt) as $chunk) {
                echo "data: " . json_encode([
                    'type' => 'chunk',
                    'content' => $chunk
                ]) . "\n\n";

                if (ob_get_level()) {
                    ob_flush();
                }
                flush();
            }

            echo "data: " . json_encode(['type' => 'end']) . "\n\n";
        }, 200, [
            'Content-Type' => 'text/plain',
            'Cache-Control' => 'no-cache',
            'Connection' => 'keep-alive',
        ]);
    }


    public function models(): JsonResponse
    {
        $models = $this->ollama->getModels();

        return response()->json([
            'success' => true,
            'models' => $models,
        ]);
    }


    public function health(): JsonResponse
    {
        $isHealthy = $this->ollama->isHealthy();

        return response()->json([
            'success' => true,
            'healthy' => $isHealthy,
            'timestamp' => now()->toISOString(),
        ]);
    }
}
