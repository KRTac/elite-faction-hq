import { useContext } from 'react';
import useStorageState from 'use-storage-state';
import { formatDistance } from 'date-fns';
import SystemFilters from './SystemFilters';
import { SystemFiltersContext, availableSystemGroups } from '../hooks/useSystemFilters';
import useFactionDataset from '../hooks/useFactionDataset';
import useSystemsGroupBy from '../hooks/useSystemsGroupBy';
import Switch from './inputs/Switch';
import Button from './inputs/Button';
import FilterBox from './inputs/FilterBox';
import Range from './inputs/Range';
import useDatasetComparison from '../hooks/useDatasetComparison';
import { dateTimeText } from '../lib/string';
import { filterRange } from '../lib/input';


function SystemsHeader({ viewType, setViewType }) {
  const { systems: filteredSystems, isFiltering } = useContext(SystemFiltersContext);
  const {
    groupBy, setGroupBy, systemCountRange, setSystemCountRange, systemCount: groupedSystemCount
  } = useSystemsGroupBy(filteredSystems);
  const { systems } = useFactionDataset();
  const [ visibleFilters, setVisibleFilters ] = useStorageState('systems_visibleFilters', {
    defaultValue: 'all',
    sync: false
  });
  const {
    isActive: isComparing,
    isAvailable: comparisonAvailable,
    setIsActive: setIsComparing,
    result, dataset
  } = useDatasetComparison();
  const { timestamp: refTimestamp } = useFactionDataset();
  const numOfChanges = comparisonAvailable ? result.changedSystems : [];
  const compareWith = isComparing ? dataset.timestamp : '';

  const filteredRange = filterRange(systemCountRange);
  const groupRangeActive = (
    groupBy !== 'None' &&
    (
      (filteredRange[0] !== '' && filteredRange[0] !== 0) ||
      (filteredRange[1] !== '' && filteredRange[1] !== 0)
    )
  );

  return (
    <div className="p-3">
      <div className="dark:bg-neutral-900 m-auto p-2 rounded-md">
        <div
          className={[
            'mb-3 mx-auto max-w-site',
            visibleFilters && !isComparing ? 'block' : 'hidden'
          ].join(' ')}
        >
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
                reset={() => setSystemCountRange([ '', '' ])}
                disabled={groupBy === 'None'}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-center items-center max-w-7xl mx-auto">
          <button
            className={[
              comparisonAvailable ? 'block' : 'hidden',
              'py-1 pl-1 pr-1 mr-2 text-sm',
              'transition duration-200',
              'cursor-pointer flex gap-1 items-center',
              isComparing ? '' : 'opacity-65 hover:opacity-100',
              'dark:text-yellow-400'
            ].join(' ')}
            onClick={() => setIsComparing(!isComparing)}
          >
            <input type="checkbox" checked={isComparing} readOnly />
            Compare view
          </button>
          {isComparing && (
            <>
              <p className="dark:text-neutral-400 text-sm" title={dateTimeText(compareWith, true)}>
                <strong className="dark:text-neutral-300">{numOfChanges.length}</strong>
                {` change${numOfChanges.length === 1 ? '' : 's'}`}
                {` in ${formatDistance(refTimestamp, compareWith)}`}
              </p>
            </>
          )}
          {!isComparing && (
            <p className="dark:text-neutral-400 text-sm">
              {isFiltering && <>
                <strong className="dark:text-neutral-300">{groupedSystemCount} </strong>
                systems filtered from
                <strong className="dark:text-neutral-300"> {systems.length} </strong>
              </>}
              {!isFiltering && <>
                <strong className="dark:text-neutral-300">{groupedSystemCount}</strong> systems
              </>}
            </p>
          )}
          <div className="dark:text-neutral-200 flex gap-3 items-center ml-auto">
            <div className="w-20">
              <Switch
                checked={viewType === 'map'}
                onChange={() => {
                  setViewType(viewType === 'map' ? 'table' : 'map');
                }}
              >
                {viewType === 'map' ? 'Map' : 'Table'}
              </Switch>
            </div>
            <Button
              smaller
              disabled={isComparing}
              onClick={() => {
                setVisibleFilters(visibleFilters === 'all' ? '' : 'all');
              }}
            >
              {visibleFilters === 'all' && !isComparing
                ? 'Hide'
                : 'Filters'
              }
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SystemsHeader;
