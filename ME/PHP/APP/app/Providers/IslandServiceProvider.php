<?php

namespace App\Providers;

use App\View\Components\Island;
use Illuminate\Support\Facades\Blade;
use Illuminate\Support\ServiceProvider;

class IslandServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        Blade::component('island', Island::class);
    }
}
