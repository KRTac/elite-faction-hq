import { lazy } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';

import { factions, root_path } from '../../assets/factions_meta.json';
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

export const Route = createFileRoute('/$factionDir')({
  loaderDeps: ({ search }) => ({ timestamp: search.dataset }),
  loader: async ({ params: { factionDir }, deps: { timestamp }}) => {
    const faction = factions.find(f => f.directory === factionDir);
    let dataset;

    if (!faction) {
      throw new Error('Faction not found');
    }

    if (!timestamp) {
      timestamp = faction.datasets[0];
    }

    const jsonUrl = `${import.meta.env.BASE_URL}${root_path.replace(/^\/+/, '')}${factionDir}/${timestamp}.json`;
    try {
      dataset = await fetch(jsonUrl).then(res => res.json());
    } catch (ex) {
      throw new Error('Requested faction data doesn\'t exist');
    }

    return { faction, dataset };
  },
  component: FactionAppRoute,
  errorComponent: ErrorComponent
});
