import { lazy } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';

import StandardPage from '../../components/layouts/Standard';
import { datasetUrl, fetchDataset, previousDataset } from '../../lib/factionDataset';
import Button from '../../components/inputs/Button';


const FactionAppRoute = lazy(() => import('../../components/layouts/FactionApp'));

function ErrorComponent({ error }) {
  return (
    <StandardPage>
      <div className="flex flex-col justify-center items-center gap-10 p-3 pt-10 max-w-2xl mx-auto">
        <p className="text-xl text-center">{error.message}</p>
        <div className="flex justify-center gap-3">
          <Button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            alt
          >
            Attempt reset and reload
          </Button>
          <Button as={Link} to="/">
            To Faction list
          </Button>
        </div>
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

    const data = await fetchDataset(datasetUrl(factionDir, timestamp));

    let compareDaysOld = 1;

    if (!import.meta.env.SSR) {
      compareDaysOld = localStorage.getItem('compareDataset_daysOld') ?? compareDaysOld;
    }

    let compareData = null;

    if (compareDaysOld > 0) {
      const compareName = previousDataset(timestamp, faction.datasets, compareDaysOld);
      compareData = await fetchDataset(datasetUrl(factionDir, compareName));
    }

    return { faction, data, compareData };
  },
  component: FactionAppRoute,
  pendingComponent: PendingComponent,
  errorComponent: ErrorComponent,
  pendingMs: 100
});
