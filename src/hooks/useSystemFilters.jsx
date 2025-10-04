import {
  useContext, useState, useMemo, createContext, useCallback
} from 'react';
import { useNavigate } from '@tanstack/react-router';
import useFactionDataset from '../hooks/useFactionDataset';
import { filterSystems, tableColumnDefinition } from '../lib/starSystems';


export const SystemFiltersContext = createContext(null);

export function useSystemFilter(filter) {
  const { values, options, setFilter } = useContext(SystemFiltersContext);
  const value = values[filter] || [];

  return {
    isActive: value.length > 0,
    value,
    options: options[filter],
    set: val => setFilter(filter, val),
    reset: () => setFilter(filter, [])
  };
}

export function useSystemsColumnDefinitions(columns, { shortenedPowers }) {
  const navigate = useNavigate();
  const factionData = useFactionDataset();

  return useMemo(() => {
    const definitions = [];

    for (const column of columns) {
      definitions.push(tableColumnDefinition(
        column,
        {
          shortenedPowers,
          factionName: factionData.faction,
          navigate
        }
      ));
    }

    return definitions;
  }, [ columns, shortenedPowers, factionData.faction, navigate ]);
}

export const availableSystemGroups = [
  'None', 'Controlling power', 'Faction priority'
];

function useSystemFilters({ stats, systems }) {
  const filterOptions = useMemo(() => {
    const filterOptions = {
      keySystems: [ true, false ],
      influenceClose: [ true, false ],
      factionInfluence: [ 0, 100 ],
      population: [ 0, undefined ]
    };

    for (const stat of Object.keys(stats)) {
      if (
        stat === 'totalPopulation' ||
        stat === 'proccessedSystems'
      ) {
        continue;
      }

      const options = []

      for (const { value } of stats[stat]) {
        options.push(value);
      }

      filterOptions[stat] = options;
    }

    return filterOptions;
  }, [ stats ]);

  const [ activeFilters, setActiveFilters ] = useState({});

  const setFilter = useCallback((filter, value) => {
    const newFilters = { ...activeFilters };

    if (
      value === undefined ||
      (Array.isArray(value) && !value.length)
    ) {
      delete newFilters[filter];
    } else {
      newFilters[filter] = value;
    }

    setActiveFilters(newFilters);
  }, [ activeFilters ]);

  const resetFilters = useCallback(() => {
    setActiveFilters({});
  }, []);

  return useMemo(() => {
    return {
      isFiltering: Object.keys(activeFilters).length > 0,
      values: activeFilters,
      options: filterOptions,
      setFilter,
      resetFilters,
      availableSystemGroups,
      systems: filterSystems(systems, activeFilters)
    };
  }, [ activeFilters, filterOptions, setFilter, systems ]);
}

export default useSystemFilters;
