<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json(['message' => 'Hello from Laravel on Temps!']);
});

Route::get('/health', function () {
    return response()->json(['status' => 'ok']);
});
