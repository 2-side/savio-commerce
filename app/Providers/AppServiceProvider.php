<?php

namespace App\Providers;

use Filament\Panel;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Lunar\Admin\Support\Facades\LunarPanel;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        LunarPanel::panel(fn (Panel $panel) => $panel
            ->viteTheme('resources/css/filament/lunar/theme.css')
            ->navigationGroups([
                'Catalog',
                'Sales',
                'CMS',
                'Reports',
                'Shipping',
                'Settings',
            ]))  
            ->register();
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
    }
}
