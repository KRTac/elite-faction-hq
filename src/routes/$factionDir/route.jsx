import { lazy } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';

import StandardPage from '../../components/layouts/Standard';
import { datasetUrl, fetchDataset } from '../../lib/factionDataset';


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

export const Route = createFileRoute('/$factionDir')({
  loaderDeps: ({ search }) => ({ timestamp: search.dataset }),
  loader: async ({
    params: { factionDir },
    deps: { timestamp },
    context: { factionsMeta: { factions } }
  }) => {
    const faction = factions.find(f => f.directory === factionDir);

    if (!faction) {
      throw new Error('Faction not found');
    }

    if (!timestamp) {
      timestamp = faction.datasets[0];
    }

    const jsonUrl = datasetUrl(factionDir, timestamp);
    const dataset = await fetchDataset(jsonUrl);

    return { faction, dataset };
  },
  component: FactionAppRoute,
  pendingComponent: PendingComponent,
  errorComponent: ErrorComponent
});
