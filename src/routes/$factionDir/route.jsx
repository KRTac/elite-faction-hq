import { createFileRoute } from '@tanstack/react-router';
import FactionApp from '../../components/layouts/FactionApp';

import { factions, root_path } from '../../assets/factions_meta.json';


function ErrorComponent({ error }) {
  return (
    <div className="min-h-48 flex justify-center items-center p-3">
      <p className="text-2xl text-center">{error.message}</p>
    </div>
  );
}

function Faction() {
  const { faction, dataset } = Route.useLoaderData();

  return <FactionApp faction={faction} dataset={dataset} />;
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
  component: Faction,
  errorComponent: ErrorComponent
});
