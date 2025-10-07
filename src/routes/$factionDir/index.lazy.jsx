import useStorageState from 'use-storage-state';
import { createLazyFileRoute } from '@tanstack/react-router';
import SystemsMapView from '../../components/SystemsMapView';
import SystemsTablesView from '../../components/SystemsTablesView';
import SystemsHeader from '../../components/SystemsHeader';
import useSystemsGroupBy from '../../hooks/useSystemsGroupBy';
import useDatasetComparison from '../../hooks/useDatasetComparison';


function Systems() {
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
        {viewType === 'map' && (
          <SystemsMapView
            groupBy={isComparing ? 'Comparison' : groupBy}
            groups={isComparing ? compareGroups : groups}
          />
        )}
        {viewType !== 'map' && (
          <SystemsTablesView
            groups={isComparing ? compareGroups : groups}
            emptyText={isComparing ? 'No changes to report' : undefined}
          />
        )}
      </div>
    </>
  );
}

export const Route = createLazyFileRoute('/$factionDir/')({
  component: Systems
});
