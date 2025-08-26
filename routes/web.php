<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('app');
});

// Tambahkan route fallback untuk SPA
Route::fallback(function () {
    return view('app');
});
