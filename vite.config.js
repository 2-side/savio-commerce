import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/js/app.tsx',
                'resources/css/filament/lunar/theme.css',
            ],
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ],
    build: {
        // Native lightningcss binary can't be used here — see report.
        cssMinify: false,
    },
});
