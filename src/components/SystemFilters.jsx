import { useContext } from 'react';
import { SystemsFilterBox } from './inputs/FilterBox';
import { SystemFiltersContext } from '../hooks/useSystemFilters';


const filterList = [
  {
    filter: 'controllingFactions',
    label: 'Controlling faction'
  },
  {
    filter: 'controllingPowers',
    label: 'Controlling power'
  },
  {
    filter: 'powerStates',
    label: 'Power states'
  },
  {
    filter: 'powers',
    label: 'Power present'
  },
  {
    filter: 'governments',
    label: 'Governments'
  },
  {
    filter: 'allegiances',
    label: 'Allegiances'
  },
  {
    filter: 'primaryEconomies',
    label: 'Primary economies'
  },
  {
    filter: 'secondaryEconomies',
    label: 'Secondary economies'
  },
  {
    filter: 'securityStates',
    label: 'Security states'
  },
  {
    filter: 'keySystems',
    label: 'Key systems'
  },
  {
    filter: 'influenceClose',
    label: 'Influence close'
  },
  {
    filter: 'activeStates',
    label: 'Active states'
  },
  {
    filter: 'pendingStates',
    label: 'Pending states'
  },
  {
    filter: 'recoveringStates',
    label: 'Recovering states'
  }
];

function SystemFilters({ activeOnly }) {
  const activeFilters = Object.keys(useContext(SystemFiltersContext).values);

  return (
    <div className="flex flex-wrap justify-center gap-3">
      {filterList.map(def => {
        if (activeOnly && !activeFilters.includes(def.filter)) {
          return null;
        }

        return (
          <div key={def.filter} className="w-full max-w-sm">
            <SystemsFilterBox label={def.label} filter={def.filter} />
          </div>
        );
      })}
    </div>
  );
}

export default SystemFilters;
