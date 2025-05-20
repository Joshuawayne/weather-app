<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',       // <<< ENSURE THIS LINE IS PRESENT
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
        apiPrefix: 'api',                       // <<< ENSURE THIS IS 'api'
        // For older syntax, it might be: then: function () { Route::middleware('api')->prefix('api/v2')->name('api.v2.')->group(base_path('routes/api_v2.php')); }
    )
    ->withMiddleware(function (Middleware $middleware) {
        // $middleware->web(append: [ // Example middleware modification
        //     \App\Http\Middleware\HandleInertiaRequests::class,
        //     \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        // ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();