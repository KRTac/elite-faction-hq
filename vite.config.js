import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import { resolve } from 'path';
import updateFactionsMeta from './plugins/update_factions_meta';


process.env.VITE_BASE_PATH = process.env.VITE_BASE_PATH || '/';

// https://vite.dev/config/
export default defineConfig(() => {
  return {
    base: process.env.VITE_BASE_PATH,
    plugins: [
      tanstackRouter({
        target: 'react',
        autoCodeSplitting: true
      }),
      react(),
      tailwindcss(),
      updateFactionsMeta()
    ],
    build: {
      manifest: true,
      rollupOptions: {
        external: [
          '/plugins/',
          '/py/',
          '/public/faction_data/',
          '/public/faction_data_dev/'
        ],
        input: {
          main: resolve(__dirname, 'index.html'),
          edMap: resolve(__dirname, 'edmap.html')
        }
      }
    }
  };
});
