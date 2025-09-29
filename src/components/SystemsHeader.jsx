import { useContext } from 'react';
import useStorageState from 'use-storage-state';
import SystemFilters from './SystemFilters';
import { SystemFiltersContext, availableSystemGroups } from '../hooks/useSystemFilters';
import { FactionDatasetContext } from '../hooks/useFactionDataset';
import useSystemsGroupBy from '../hooks/useSystemsGroupBy';
import Switch from './inputs/Switch';
import Button from './inputs/Button';
import FilterBox from './inputs/FilterBox';
import Range from './inputs/Range';


function SystemsHeader({ viewType, setViewType }) {
  const { systems: filteredSystems, isFiltering } = useContext(SystemFiltersContext);
  const { groupBy, setGroupBy } = useSystemsGroupBy(filteredSystems);
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
            <div className="mt-5 w-full max-w-site flex justify-center mx-auto">
              <div className="w-full max-w-sm mx-auto">
                <FilterBox
                  label="Group by"
                  value={groupBy}
                  options={availableSystemGroups}
                  isActive={groupBy !== 'None'}
                  set={setGroupBy}
                  reset={() => setGroupBy('None')}
                />
              </div>
              {/* <div className="w-full max-w-sm mx-auto">
                <Range
                  label="Group system count"
                  value={[ 2, 5]}
                  min={0}
                  max={100}
                />
              </div> */}
            </div>
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
