import { Outlet, useLoaderData } from '@tanstack/react-router';
import Header from '../Header';
import SystemModal from '../SystemModal';
import { FactionContext } from '../../hooks/useFaction';
import useFactionDataset, { FactionDatasetContext } from '../../hooks/useFactionDataset';
import useSystemFilters, { SystemFiltersContext } from '../../hooks/useSystemFilters';


function FactionAppRoute() {
  const { faction, dataset } = useLoaderData({ from: '/$factionDir' });

  return <FactionApp faction={faction} dataset={dataset} />;
}

export function FactionApp({ faction, dataset }) {
  const factionDataset = useFactionDataset(dataset);
  const systemFilters = useSystemFilters(factionDataset);

  return (
    <FactionContext value={faction}>
      <FactionDatasetContext value={factionDataset}>
        <SystemFiltersContext value={systemFilters}>
          <div className="flex flex-col h-screen">
            <Header
              factionName={faction.name}
            />
            <Outlet />
          </div>
          <SystemModal />
        </SystemFiltersContext>
      </FactionDatasetContext>
    </FactionContext>
  );
}

export default FactionAppRoute;
