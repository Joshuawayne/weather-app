<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\WeatherController; // Import your controller

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// This route will be automatically prefixed with /api by Laravel
// We add /v1 ourselves
Route::prefix('v1')->group(function () {
    Route::get('/weather/{city}', [WeatherController::class, 'show'])
        ->where('city', '[a-zA-Z\s\-]+'); // Basic validation for city parameter
});