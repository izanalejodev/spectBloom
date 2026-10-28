<?php

use App\Http\Controllers\ActividadController;
use App\Http\Controllers\ObjetivoController;
use App\Http\Controllers\TipoObjetivoController;
use App\Http\Controllers\KidController;
use App\Http\Controllers\TipoActividadController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use App\Http\Controllers\AiChatController;
use App\Http\Controllers\CalendarioNinoController;
use App\Http\Controllers\QuedadasController;
use App\Http\Controllers\TiposQuedadasController;
use App\Http\Controllers\DiarioController;
use App\Http\Controllers\PictogramaController;
use App\Http\Controllers\GoogleAuthController;
use App\Http\Controllers\AdminController;


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/auth/google', [GoogleAuthController::class, 'handleGoogleToken']);


Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::get('/kids', [KidController::class, 'index']);
    Route::post('/kids', [KidController::class, 'store']);

    // Quedadas
    Route::get('quedadas',                    [QuedadasController::class, 'index']);
    Route::post('quedadas',                    [QuedadasController::class, 'store']);
    Route::delete('quedadas/{id}',               [QuedadasController::class, 'destroy']);
    Route::post('quedadas/{id}/inscribirse',   [QuedadasController::class, 'inscribirse']);
    Route::put('/quedadas/{id}',              [QuedadasController::class, 'update']);
    Route::delete('quedadas/{id}/inscribirse',   [QuedadasController::class, 'cancelarInscripcion']);

    //Objetivos
    Route::get('objetivos', [ObjetivoController::class, 'index']);
    Route::post('objetivos', [ObjetivoController::class, 'store']);
    Route::delete('objetivos/{id}', [ObjetivoController::class, 'destroy']);
    Route::put('objetivos/{id}', [ObjetivoController::class, 'update']);
    
    //Tipos-actividades
    Route::get('/tipos-actividades', [TipoActividadController::class, 'index']);
    Route::post('/tipos-actividades', [TipoActividadController::class, 'store']);
    Route::delete('/tipos-actividades/{id}', [TipoActividadController::class, 'destroy']);
    Route::put('/tipos-actividades/{id}', [TipoActividadController::class, 'update']);

    //Tipos Objetivo
    Route::get('/tipos-objetivos', [TipoObjetivoController::class, 'index']);
    Route::post('/tipos-objetivos', [TipoObjetivoController::class, 'store']);
    Route::delete('/tipos-objetivos/{id}', [TipoObjetivoController::class, 'destroy']);
    Route::put('/tipos-objetivos/{id}', [TipoObjetivoController::class, 'update']);


    Route::get('diario/{kidId}',  [DiarioController::class, 'index']);
    Route::post('diario',         [DiarioController::class, 'store']);
    Route::put('diario/{id}',     [DiarioController::class, 'update']);
    Route::delete('diario/{id}',  [DiarioController::class, 'destroy']);

    Route::patch('objetivos/{id}/marcas', [ObjetivoController::class, 'updateMarcas']);

    Route::get('/admin/users',        [AdminController::class, 'index']);
    Route::post('/admin/users',       [AdminController::class, 'store']);
    Route::put('/admin/users/{id}',   [AdminController::class, 'update']);
    Route::delete('/admin/users/{id}',[AdminController::class, 'destroy']);
});

Route::prefix('ai')->group(function () {
    Route::post('/chat', [AiChatController::class, 'chat']);
    Route::post('/generate', [AiChatController::class, 'chat']);
    Route::get('/models', [AiChatController::class, 'models']);
    Route::get('/health', [AiChatController::class, 'health']);
});

Route::post('/actividades', [ActividadController::class, 'store']);
Route::get('/actividades', [ActividadController::class, 'index']);
Route::delete('/actividades/{id}', [ActividadController::class, 'destroy']);
Route::put('/actividades/{id}', [ActividadController::class, 'update']);



Route::get('/actividades-hoy/{kidId}', [CalendarioNinoController::class, 'getActividadesHoy']);
Route::patch('/actividades/{id}/completar', [CalendarioNinoController::class, 'completarActividad']);

Route::post('/emociones', [CalendarioNinoController::class, 'guardarEmocion']);
Route::get('/nino/{id}', [CalendarioNinoController::class, 'getNino']);

Route::post('/emociones-kid', [CalendarioNinoController::class, 'guardarEmocion']);
Route::delete('/kids/{id}', [KidController::class, 'destroy']);
Route::put('/kids/{id}', [KidController::class, 'update']);

Route::get('/tipos-quedadas', [TiposQuedadasController::class, 'index']);

Route::post('/pictogramas', [PictogramaController::class, 'store']);
