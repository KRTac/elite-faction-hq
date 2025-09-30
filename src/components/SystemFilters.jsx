import { useContext } from 'react';
import { SystemsFilterBox } from './inputs/FilterBox';
import { SystemFiltersContext } from '../hooks/useSystemFilters';
import Tabs, { TabPanel } from './data/Tabs';
import { SystemsFilterRange } from './inputs/Range';


const filterList = [
  {
    id: 'controllingFactions',
    label: 'Controlling faction'
  },
  {
    id: 'controllingPowers',
    label: 'Controlling power'
  },
  {
    id: 'powerStates',
    label: 'Power states'
  },
  {
    id: 'powers',
    label: 'Power present'
  },
  {
    id: 'governments',
    label: 'Governments'
  },
  {
    id: 'allegiances',
    label: 'Allegiances'
  },
  {
    id: 'primaryEconomies',
    label: 'Primary economies'
  },
  {
    id: 'secondaryEconomies',
    label: 'Secondary economies'
  },
  {
    id: 'securityStates',
    label: 'Security states'
  },
  {
    id: 'keySystems',
    label: 'Key systems'
  },
  {
    id: 'influenceClose',
    label: 'Influence close'
  },
  {
    id: 'activeStates',
    label: 'Active states'
  },
  {
    id: 'pendingStates',
    label: 'Pending states'
  },
  {
    id: 'recoveringStates',
    label: 'Recovering states'
  },
  {
    id: 'factionInfluence',
    label: 'Faction influence',
    range: true
  },
  {
    id: 'population',
    label: 'Population',
    range: true
  }
];

const tabData = [
  {
    title: 'General',
    filters: [
      'population', 'governments', 'allegiances', 'primaryEconomies', 'secondaryEconomies'
    ]
  },
  {
    title: 'Faction',
    filters: [
      'controllingFactions', 'factionInfluence', 'keySystems', 'influenceClose'
    ]
  },
  {
    title: 'Powers',
    filters: [
      'controllingPowers', 'powers', 'powerStates'
    ]
  },
  {
    title: 'System states',
    filters: [
      'activeStates', 'pendingStates', 'recoveringStates', 'securityStates'
    ]
  }
];

function SystemFilters() {
  const activeFilters = Object.keys(useContext(SystemFiltersContext).values);

  return (
    <Tabs data={tabData} activeTabs={activeFilters}>
      {tabData.map(({ title, filters }) => {
        return (
          <TabPanel key={title}>
            <div className="grid gap-2 grid-cols-[repeat(auto-fill,_minmax(350px,_1fr))] justify-center content-center">
              {filters.map(filterId => {
                const filter = filterList.find(({ id }) => id === filterId)

                if (!filter) {
                  return null;
                }

                if (filter.range) {
                  return (
                    <div key={filter.id} className="w-full">
                      <SystemsFilterRange
                        label={filter.label}
                        filter={filter.id}
                      />
                    </div>
                  );
                }

                return (
                  <div key={filter.id} className="w-full">
                    <SystemsFilterBox
                      label={filter.label}
                      filter={filter.id}
                    />
                  </div>
                );
              })}
            </div>
          </TabPanel>
        );
      })}
    </Tabs>
  );
}

export default SystemFilters;
