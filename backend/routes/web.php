<?php
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\File;
use App\Http\Controllers\AiChatController;

// Ollama AI — DEBE IR ANTES del catch-all de Angular
Route::prefix('ai')->group(function () {
    Route::get('/', [AiChatController::class, 'index'])->name('ai.chat');
    Route::post('/chat', [AiChatController::class, 'chat'])->name('ai.chat.send');
    Route::post('/chat/stream', [AiChatController::class, 'chatStream'])->name('ai.chat.stream');
    Route::get('/models', [AiChatController::class, 'models'])->name('ai.models');
    Route::get('/health', [AiChatController::class, 'health'])->name('ai.health');
});

// Catch-all para Angular — SIEMPRE AL FINAL
Route::get('{any}', function ($any = null) {
    $path = public_path("angular/browser/$any");
    if (File::isFile($path)) {
        return response()->file($path);
    }
    $indexPath = public_path('angular/browser/index.html');
    if (File::exists($indexPath)) {
        return file_get_contents($indexPath);
    }
    abort(404, "El build de Angular no se encuentra en public/angular/browser/");
})->where('any', '.*');