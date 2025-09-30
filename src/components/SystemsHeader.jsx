import { useContext } from 'react';
import useStorageState from 'use-storage-state';
import SystemFilters from './SystemFilters';
import { SystemFiltersContext, availableSystemGroups } from '../hooks/useSystemFilters';
import { FactionDatasetContext } from '../hooks/useFactionDataset';
import useSystemsGroupBy from '../hooks/useSystemsGroupBy';
import Switch from './inputs/Switch';
import Button from './inputs/Button';
import FilterBox from './inputs/FilterBox';
import Range, { filterRange } from './inputs/Range';


function SystemsHeader({ viewType, setViewType }) {
  const { systems: filteredSystems, isFiltering } = useContext(SystemFiltersContext);
  const {
    groupBy, setGroupBy, systemCountRange, setSystemCountRange
  } = useSystemsGroupBy(filteredSystems);
  const { systems } = useContext(FactionDatasetContext);
  const [ visibleFilters, setVisibleFilters ] = useStorageState('systems_visibleFilters', {
    defaultValue: 'all',
    sync: false
  }); 

  const filteredRange = filterRange(systemCountRange);
  const groupRangeActive = (
    groupBy !== 'None' &&
    (
      (filteredRange[0] !== '' && filteredRange[0] !== 0) ||
      (filteredRange[1] !== '' && filteredRange[1] !== 0)
    )
  )

  return (
    <div className="p-3">
      <div className="dark:bg-neutral-900 m-auto p-2 rounded-md">
        {visibleFilters && (
          <div className="mb-3 mx-auto max-w-site">
            <SystemFilters activeOnly={visibleFilters === 'active'} />
            <div className="mt-7 w-full max-w-site flex justify-center mx-auto gap-3">
              <div className="w-full max-w-sm">
                <FilterBox
                  label="Group by"
                  value={groupBy}
                  options={availableSystemGroups}
                  isActive={groupBy !== 'None'}
                  set={setGroupBy}
                  reset={() => setGroupBy('None')}
                />
              </div>
              <div className="w-full max-w-sm">
                <Range
                  label="Group system count"
                  value={systemCountRange}
                  isActive={groupRangeActive}
                  set={setSystemCountRange}
                  disabled={groupBy === 'None'}
                />
              </div>
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
