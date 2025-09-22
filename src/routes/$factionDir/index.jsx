import { useContext } from 'react';
import useStorageState from 'use-storage-state';
import { createFileRoute } from '@tanstack/react-router';
import SystemsMapView from '../../components/SystemsMapView';
import SystemsTablesView from '../../components/SystemsTablesView';
import SystemsHeader from '../../components/SystemsHeader';
import { SystemFiltersContext } from '../../hooks/useSystemFilters';


function Systems() {
  const { filtered: { systems, groups }} = useContext(SystemFiltersContext);
  const [ viewType, setViewType ] = useStorageState('systems_viewType', {
    defaultValue: 'map',
    sync: false
  });

  return (
    <>
      <SystemsHeader viewType={viewType} setViewType={setViewType} />
      <div className="flex-1 overflow-y-scroll relative">
        {viewType === 'map' && <SystemsMapView systems={systems} debug />}
        {viewType !== 'map' && <SystemsTablesView systems={systems} groups={groups} />}
      </div>
    </>
  );
}

export const Route = createFileRoute('/$factionDir/')({
  component: Systems
});
