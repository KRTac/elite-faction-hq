import { useContext } from 'react';
import useStorageState from 'use-storage-state';
import SystemFilters from './SystemFilters';
import { SystemFiltersContext } from '../hooks/useSystemFilters';
import { FactionDatasetContext } from '../hooks/useFactionDataset';
import Switch from './inputs/Switch';
import Button from './inputs/Button';


function SystemsHeader({ viewType, setViewType }) {
  const { filtered: { systems: filteredSystems }, isFiltering } = useContext(SystemFiltersContext);
  const { systems } = useContext(FactionDatasetContext);
  const [ visibleFilters, setVisibleFilters ] = useStorageState('systems_visibleFilters', {
    defaultValue: 'all', // 'all', 'active', ''
    sync: false
  });

  return (
    <div className="p-3">
      <div className="dark:bg-neutral-900 m-auto p-2 rounded-md">
        {visibleFilters && (
          <div className="mb-3">
            <SystemFilters activeOnly={visibleFilters === 'active'} />
          </div>
        )}
        <div className="flex flex-row justify-center items-center max-w-7xl mx-auto">
          <p className="dark:text-neutral-400 mr-auto text-sm">
            {isFiltering && <>
              <strong className="dark:text-neutral-300">{filteredSystems.length} </strong>
              systems filtered from
              <strong className="dark:text-neutral-300"> {systems.length} </strong>  
            </>}
            {!isFiltering && <>
              <strong className="dark:text-neutral-300">{systems.length}</strong> systems  
            </>}
          </p>
          <div className="dark:text-neutral-200 flex gap-3 items-center">
            <Switch
              checked={viewType === 'map'}
              onChange={() => {
                setViewType(viewType === 'map' ? 'table' : 'map');
              }}
              labelFlip
            >
              {viewType === 'map' ? 'Map' : 'Table'}
            </Switch>
            <Button
              onClick={() => {
                setVisibleFilters(visibleFilters === 'all' ? '' : 'all');
              }}
            >
              {visibleFilters === 'all'
                ? 'Hide'
                : 'Show'
              }
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SystemsHeader;
