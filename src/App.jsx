import { RouterProvider, createRouter } from '@tanstack/react-router';
import { DatasetsMetaContext } from './hooks/useDatasetsMeta';
import './index.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';

import { routeTree } from './routeTree.gen';


function clientInit() {
  const datasetsMeta = window.datasets_meta;
  const router = createRouter({
    basepath: import.meta.env.BASE_URL,
    routeTree
  });

  return { datasetsMeta, router };
}

const { datasetsMeta, router } = import.meta.env.SSR
  ? { datasetsMeta: undefined, router: undefined }
  : clientInit();

if (!import.meta.env.SSR && import.meta.env.VITE_GA_TAG) {
  router.subscribe('onResolved', () => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href
      });
    }
  });
}

const routerContext = { datasetsMeta };

export function App() {
  if (!datasetsMeta) {
    console.warn('Factions meta not set.');
    console.warn(`Is SSR: ${import.meta.env.SSR ? 'yes' : 'no'}`);
  }

  return (
    <DatasetsMetaContext value={datasetsMeta}>
      <RouterProvider router={router} context={routerContext} />
    </DatasetsMetaContext>
  );
}

export default App;
