import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import { VitePluginRadar } from 'vite-plugin-radar'
import updateDatasetsMeta from './plugins/update_datasets_meta';


process.env.VITE_BASE_PATH = process.env.VITE_BASE_PATH ?? '/';
process.env.VITE_PROTOCOL_HOSTNAME = process.env.VITE_PROTOCOL_HOSTNAME ?? '/';

// https://vite.dev/config/
export default defineConfig(() => {
  const plugins = [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true
    }),
    react(),
    tailwindcss(),
    updateDatasetsMeta()
  ];

  if (process.env.VITE_GA_TAG) {
    plugins.push(VitePluginRadar({
      enableDev: false,
      analytics: {
        id: process.env.VITE_GA_TAG,
        config: {
          cookie_domain: process.env.VITE_GA_DOMAIN ?? 'auto',
          send_page_view: false
        }
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
