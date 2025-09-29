import { Outlet, useLoaderData } from '@tanstack/react-router';
import Header from '../Header';
import SystemModal from '../SystemModal';
import { FactionContext } from '../../hooks/useFaction';
import useFactionDataset, { FactionDatasetContext } from '../../hooks/useFactionDataset';
import useSystemFilters, { SystemFiltersContext } from '../../hooks/useSystemFilters';
import { SystemsGroupByContext, useCreateSystemsGroupBy } from '../../hooks/useSystemsGroupBy';


function FactionAppRoute() {
  const { faction, dataset } = useLoaderData({ from: '/$factionDir' });

  return <FactionApp faction={faction} dataset={dataset} />;
}

export function FactionApp({ faction, dataset }) {
  const factionDataset = useFactionDataset(dataset);
  const systemFilters = useSystemFilters(factionDataset);
  const groupBy = useCreateSystemsGroupBy(systemFilters.systems);

  return (
    <FactionContext value={faction}>
      <FactionDatasetContext value={factionDataset}>
        <SystemFiltersContext value={systemFilters}>
          <SystemsGroupByContext value={groupBy}>
            <div className="flex flex-col h-screen">
              <Header
                factionName={faction.name}
              />
              <Outlet />
            </div>
            <SystemModal />
          </SystemsGroupByContext>
        </SystemFiltersContext>
      </FactionDatasetContext>
    </FactionContext>
  );
}

export default FactionAppRoute;
