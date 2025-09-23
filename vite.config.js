import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import updateFactionsMeta from './plugins/update_factions_meta';


// https://vite.dev/config/
export default defineConfig(() => {
  return {
    base: process.env.BASE_PATH,
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
        external: [ '/plugins/', '/py/', '/public/faction_data/' ]
      }
    }
  };
});
