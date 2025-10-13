import { Activity } from 'react';
import useStorageState from 'use-storage-state';
import { createLazyFileRoute } from '@tanstack/react-router';
import SystemsMapView from '../../components/SystemsMapView';
import SystemsTablesView from '../../components/SystemsTablesView';
import SystemsHeader from '../../components/SystemsHeader';
import useSystemsGroupBy from '../../hooks/useSystemsGroupBy';
import useDatasetComparison from '../../hooks/useDatasetComparison';
import useFaction from '../../hooks/useFaction';


function Systems() {
  const { name: factionName } = useFaction();
  const { groupBy, groups } = useSystemsGroupBy();
  const [ viewType, setViewType ] = useStorageState('systems_viewType', {
    defaultValue: 'map',
    sync: false
  });
  const { isActive: isComparing, displayGroups: compareGroups } = useDatasetComparison();

  return (
    <>
      <SystemsHeader viewType={viewType} setViewType={setViewType} />
      <div className="flex-1 overflow-y-scroll">
        <Activity mode={viewType === 'map' ? 'visible' : 'hidden'}>
          <SystemsMapView
            groupBy={isComparing
              ? 'Comparison'
              : groupBy === 'None' ? factionName : groupBy
            }
            groups={isComparing ? compareGroups : groups}
          />
        </Activity>
        <Activity mode={viewType !== 'map' ? 'visible' : 'hidden'}>
          <SystemsTablesView
            groups={isComparing ? compareGroups : groups}
            emptyText={isComparing ? 'No changes to report' : undefined}
          />
        </Activity>
      </div>
    </>
  );
}

export const Route = createLazyFileRoute('/$factionDir/')({
  component: Systems
});
