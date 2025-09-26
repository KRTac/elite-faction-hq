import { RouterProvider, createRouter } from '@tanstack/react-router';
import { FactionsMetaContext } from './hooks/useFactionsMeta';
import './index.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';

import { routeTree } from './routeTree.gen';


const factionsMeta = window.factions_meta;
const router = createRouter({
  basepath: import.meta.env.BASE_URL,
  routeTree
});

export function App() {
  return (
    <FactionsMetaContext value={factionsMeta}>
      <RouterProvider router={router} context={{ factionsMeta }} />
    </FactionsMetaContext>
  );
}

export default App;
