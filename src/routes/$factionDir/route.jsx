import { lazy } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import * as Sentry from '@sentry/browser';

import StandardPage from '../../components/layouts/Standard';
import { datasetUrl, fetchDataset, previousDataset } from '../../lib/factionDataset';
import Button from '../../components/inputs/Button';


const FactionAppRoute = lazy(() => import('../../components/layouts/FactionApp'));

function ErrorComponent({ error }) {
  Sentry.captureException(error);

  return (
    <StandardPage>
      <div className="flex flex-col justify-center items-center gap-10 p-3 pt-10 max-w-2xl mx-auto">
        <p className="text-xl text-center">{error.message}</p>
        <div className="flex justify-center gap-3">
          <Button
            alt
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
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
  loaderDeps: ({ search }) => ({
    timestamp: search.dataset,
    compareTimestamp: search.compare
  }),
  loader: async ({
    params: { factionDir },
    deps: { timestamp, compareTimestamp },
    context: { datasetsMeta: { factions, powers }}
  }) => {
    let subject = powers.find(f => f.directory === factionDir);

    if (!subject) {
      subject = factions.find(f => f.directory === factionDir);
    }

    if (!subject) {
      throw new Error('Faction or power not found');
    }

    if (!timestamp) {
      timestamp = subject.datasets[0];
    }

    const data = await fetchDataset(datasetUrl(factionDir, timestamp));

    let compareData = null;

    if (compareTimestamp) {
      compareData = await fetchDataset(datasetUrl(factionDir, compareTimestamp));
    } else {
      let compareDaysOld = 1;

      if (!import.meta.env.SSR) {
        compareDaysOld = localStorage.getItem('compareDataset_daysOld') ?? compareDaysOld;
      }

      if (compareDaysOld > 0) {
        const compareName = previousDataset(timestamp, subject.datasets, compareDaysOld);

        if (compareName) {
          compareData = await fetchDataset(datasetUrl(factionDir, compareName));
        }
      }
    }

    return { subject, data, compareData };
  },
  component: FactionAppRoute,
  pendingComponent: PendingComponent,
  errorComponent: ErrorComponent,
  pendingMs: 100
});
