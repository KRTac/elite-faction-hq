import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import { VitePluginRadar } from 'vite-plugin-radar'
import updateFactionsMeta from './plugins/update_factions_meta';


process.env.VITE_BASE_PATH = process.env.VITE_BASE_PATH || '/';

// https://vite.dev/config/
export default defineConfig(() => {
  const plugins = [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true
    }),
    react(),
    tailwindcss(),
    updateFactionsMeta()
  ];

  if (process.env.VITE_GA_TAG) {
    plugins.push(VitePluginRadar({
      enableDev: true,
      analytics: {
        id: process.env.VITE_GA_TAG
      }
    }));
  }

  return {
    base: process.env.VITE_BASE_PATH,
    plugins,
    build: {
      sourcemap: true,
      manifest: true,
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
          edMap: resolve(__dirname, 'edmap.html')
        }
      }
    }
  };
});
