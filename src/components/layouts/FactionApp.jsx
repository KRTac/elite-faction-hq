import { Outlet, useLoaderData } from '@tanstack/react-router';
import { useEffect } from 'react';
import Header from '../Header';
import SystemModal from '../SystemModal';
import { FactionContext } from '../../hooks/useFaction';
import { useCreateFactionDataset, FactionDatasetContext } from '../../hooks/useFactionDataset';
import useSystemFilters, { SystemFiltersContext } from '../../hooks/useSystemFilters';
import { SystemsGroupByContext, useCreateSystemsGroupBy } from '../../hooks/useSystemsGroupBy';
import { DatasetComparisonContext, useCreateDatasetComparison } from '../../hooks/useDatasetComparison';


function FactionAppRoute() {
  const { subject, data, compareData } = useLoaderData({ from: '/$factionDir' });

  return <FactionApp faction={subject} data={data} compareData={compareData} />;
}

export function FactionApp({ faction, data, compareData }) {
  const factionDataset = useCreateFactionDataset(data, faction);
  const compareDataset = useCreateFactionDataset(compareData, faction);
  const datasetComparison = useCreateDatasetComparison(factionDataset, compareDataset);
  const systemFilters = useSystemFilters(factionDataset);
  const groupBy = useCreateSystemsGroupBy(systemFilters.systems);

  const { setDataset } = datasetComparison;

  useEffect(() => {
    setDataset(compareDataset);
  }, [ compareDataset, setDataset ]);

  return (
    <FactionContext value={faction}>
      <FactionDatasetContext value={factionDataset}>
        <DatasetComparisonContext value={datasetComparison}>
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
        </DatasetComparisonContext>
      </FactionDatasetContext>
    </FactionContext>
  );
}

export default FactionAppRoute;
