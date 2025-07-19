import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    tailwindcss(),
  ],
  server: {
        host: !!process.env.VITE_HOST || '0.0.0.0',
        proxy: {
          '^/api.*': {target: `http://localhost:${process.env.GRANIAN_PORT || 8000}`}
        },
        watch: {
            ignored: ['storage', '.venv'],
        },

    },
  resolve: {
		alias: [ 
			{find: '$lib', replacement: path.resolve('src/lib')},
    ]
	}
})
