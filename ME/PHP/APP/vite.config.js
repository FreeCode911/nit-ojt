import { defineConfig } from 'vite';  
import laravel from 'laravel-vite-plugin';  
import tailwindcss from '@tailwindcss/vite';  
import react from '@vitejs/plugin-react';  
import path from 'path';  
  
export default defineConfig({  
    plugins: [  
        laravel({  
            input: ['resources/css/app.css', 'resources/js/app.jsx'],  
            refresh: true,  
        }),  
        tailwindcss(),  
        react(),  
    ],  
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './resources/js'),
        },
        // gsap/@gsap-react live in the workspace root's node_modules (ancestor of the app).
        // npm auto-installed react there too, which would duplicate React in the bundle;
        // dedupe forces every react import to resolve to the app's copy.
        dedupe: ['react', 'react-dom'],
    },
    build: {  
        rollupOptions: {  
            output: {  
                manualChunks: {  
                    charts: ['recharts'],  
                    motion: ['framer-motion'],  
                },  
            },  
        },  
    },  
    server: {  
        watch: {  
            ignored: ['**/storage/framework/views/**'],  
        },  
    },  
});  
