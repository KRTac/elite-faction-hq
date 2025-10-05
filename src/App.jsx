import { RouterProvider, createRouter } from '@tanstack/react-router';
import { FactionsMetaContext } from './hooks/useFactionsMeta';
import './index.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';

import { routeTree } from './routeTree.gen';


function clientInit() {
  const factionsMeta = window.factions_meta;
  const router = createRouter({
    basepath: import.meta.env.BASE_URL,
    routeTree
  });

  return { factionsMeta, router };
}

const { factionsMeta, router } = import.meta.env.SSR
  ? { factionsMeta: undefined, router: undefined }
  : clientInit();

if (!import.meta.env.SSR) {
  router.subscribe('onLoad', ({ toLocation }) => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_location: toLocation.href
      });
    }
  });
}

export function App() {
  if (!factionsMeta) {
    console.warn('Factions meta not set.');
    console.warn(`Is SSR: ${import.meta.env.SSR ? 'yes' : 'no'}`);
  }

  return (
    <FactionsMetaContext value={factionsMeta}>
      <RouterProvider router={router} context={{ factionsMeta }} />
    </FactionsMetaContext>
  );
}

export default App;
