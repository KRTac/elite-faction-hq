import { lazy } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';

import StandardPage from '../../components/layouts/Standard';


const FactionAppRoute = lazy(() => import('../../components/layouts/FactionApp'));

function ErrorComponent({ error }) {
  return (
    <StandardPage>
      <div className="min-h-48 flex flex-col justify-center items-center gap-3 p-3">
        <p className="text-2xl text-center">{error.message}</p>
        <Link to="/">To Faction list</Link>
      </div>
    </StandardPage>
  );
}

function PendingComponent() {
  return (
    <StandardPage>
      <div
        className={[
          'flex justify-center items-center',
          'absolute top-0 left-0 w-full h-full z-20',
          'backdrop-blur-sm'
        ].join(' ')}
      >
        <p className="text-xl text-center dark:text-neutral-400/80">Loading faction data...</p>
      </div>
    </StandardPage>
  );
}

function trimSlashes(s) {
  return s.replace(/^\/+|\/+$/g, '');
}

export const Route = createFileRoute('/$factionDir')({
  loaderDeps: ({ search }) => ({ timestamp: search.dataset }),
  loader: async ({
    params: { factionDir },
    deps: { timestamp },
    context: { factionsMeta: { factions } }
  }) => {
    const faction = factions.find(f => f.directory === factionDir);
    let dataset;

    if (!faction) {
      throw new Error('Faction not found');
    }

    if (!timestamp) {
      timestamp = faction.datasets[0];
    }

    let dataRoot = import.meta.env.VITE_FACTION_DATA_CLIENT_ROOT;

    if (!dataRoot.startsWith('http://') && !dataRoot.startsWith('https://')) {
      dataRoot = `${import.meta.env.BASE_URL}${trimSlashes(dataRoot)}`;
    }

    console.log('dataRoot', dataRoot);

    const jsonUrl = `${dataRoot}/${factionDir}/${timestamp}.json`;
    try {
      dataset = await fetch(jsonUrl).then(res => {
        if (import.meta.env.DEV) {
          return new Promise(resolve => {
            setTimeout(() => {
              resolve(res.json());
            }, 500);
          });
        }

        return res.json();
      });
    } catch (ex) {
      throw new Error('Requested faction data doesn\'t exist');
    }

    return { faction, dataset };
  },
  component: FactionAppRoute,
  pendingComponent: PendingComponent,
  errorComponent: ErrorComponent
});
