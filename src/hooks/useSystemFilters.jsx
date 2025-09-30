import {
  useContext, useState, useMemo, createContext, useCallback
} from 'react';
import { useNavigate } from '@tanstack/react-router';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { ExclamationCircleIcon } from '@heroicons/react/16/solid';
import numeral from 'numeral';
import ToClipboard from '../components/ToClipboard';
import { FactionDatasetContext } from '../hooks/useFactionDataset';
import DateTimeText, { dateTimeText } from '../components/data/DateTimeText';
import PowerName from '../components/data/PowerName';
import { filterRange } from '../components/inputs/Range';


export const SystemFiltersContext = createContext(null);

export function filterSystems(systems, filters) {
  const filteredSystems = [];

  const activeFilterKeys = Object.keys(filters);

  for (const system of systems) {
    let notFiltering = true;
    let filtersPassed = false;

    if (
      activeFilterKeys.includes('powers') &&
      filters.powers.length > 0
    ) {
      notFiltering = false;
      const powers = system.power_play.powers;

      for (const power of filters.powers) {
        if (
          powers.includes(power) ||
          (power === 'None' && (
            !powers ||
            powers.length === 0 ||
            !powers[0]
          ))
        ) {
          filtersPassed = true;
          break;
        }
      }
    }

    if (
      (notFiltering || filtersPassed) &&
      activeFilterKeys.includes('controllingPowers') &&
      filters.controllingPowers.length > 0
    ) {
      notFiltering = false;
      filtersPassed = false;

      for (const power of filters.controllingPowers) {
        if (
          system.power_play.controlling === power ||
          (power === 'None' && system.power_play.controlling === null)
        ) {
          filtersPassed = true;
          break;
        }
      }
    }

    if (
      (notFiltering || filtersPassed) &&
      activeFilterKeys.includes('controllingFactions') &&
      filters.controllingFactions.length > 0
    ) {
      notFiltering = false;
      filtersPassed = false;

      for (const faction of filters.controllingFactions) {
        if (
          system.controlling_faction === faction ||
          (faction === 'None' && system.controlling_faction === null)
        ) {
          filtersPassed = true;
          break;
        }
      }
    }

    if (
      (notFiltering || filtersPassed) &&
      activeFilterKeys.includes('powerStates') &&
      filters.powerStates.length > 0
    ) {
      notFiltering = false;
      filtersPassed = false;

      for (const state of filters.powerStates) {
        if (system.power_play.state === state) {
          filtersPassed = true;
          break;
        }
      }
    }

    if (
      (notFiltering || filtersPassed) &&
      activeFilterKeys.includes('governments') &&
      filters.governments.length > 0
    ) {
      notFiltering = false;
      filtersPassed = false;

      for (const government of filters.governments) {
        if (system.government === government) {
          filtersPassed = true;
          break;
        }
      }
    }

    if (
      (notFiltering || filtersPassed) &&
      activeFilterKeys.includes('allegiances') &&
      filters.allegiances.length > 0
    ) {
      notFiltering = false;
      filtersPassed = false;

      for (const allegiance of filters.allegiances) {
        if (system.allegiance === allegiance) {
          filtersPassed = true;
          break;
        }
      }
    }

    if (
      (notFiltering || filtersPassed) &&
      activeFilterKeys.includes('primaryEconomies') &&
      filters.primaryEconomies.length > 0
    ) {
      notFiltering = false;
      filtersPassed = false;

      for (const economy of filters.primaryEconomies) {
        if (system.primary_economy === economy) {
          filtersPassed = true;
          break;
        }
      }
    }

    if (
      (notFiltering || filtersPassed) &&
      activeFilterKeys.includes('secondaryEconomies') &&
      filters.secondaryEconomies.length > 0
    ) {
      notFiltering = false;
      filtersPassed = false;

      for (const economy of filters.secondaryEconomies) {
        if (system.secondary_economy === economy) {
          filtersPassed = true;
          break;
        }
      }
    }

    if (
      (notFiltering || filtersPassed) &&
      activeFilterKeys.includes('securityStates') &&
      filters.securityStates.length > 0
    ) {
      notFiltering = false;
      filtersPassed = false;

      for (const security of filters.securityStates) {
        if (system.security === security) {
          filtersPassed = true;
          break;
        }
      }
    }

    if (
      (notFiltering || filtersPassed) &&
      activeFilterKeys.includes('keySystems') &&
      filters.keySystems.length > 0
    ) {
      notFiltering = false;
      filtersPassed = false;

      for (const option of filters.keySystems) {
        if (
          (option === 'Yes' && system.is_key_system) ||
          (option === 'No' && !system.is_key_system)
        ) {
          filtersPassed = true;
          break;
        }
      }
    }

    if (
      (notFiltering || filtersPassed) &&
      activeFilterKeys.includes('influenceClose') &&
      filters.influenceClose.length > 0
    ) {
      notFiltering = false;
      filtersPassed = false;

      for (const option of filters.influenceClose) {
        if (
          (option === 'Yes' && system.is_faction_influence_close) ||
          (option === 'No' && !system.is_faction_influence_close)
        ) {
          filtersPassed = true;
          break;
        }
      }
    }

    if (
      (notFiltering || filtersPassed) &&
      activeFilterKeys.includes('activeStates') &&
      filters.activeStates.length > 0
    ) {
      notFiltering = false;
      filtersPassed = false;
      const states = system.active_states;

      for (const state of filters.activeStates) {
        if (
          states.includes(state) ||
          (state === 'None' && (
            !states ||
            states.length === 0 ||
            !states[0]
          ))
        ) {
          filtersPassed = true;
          break;
        }
      }
    }

    if (
      (notFiltering || filtersPassed) &&
      activeFilterKeys.includes('pendingStates') &&
      filters.pendingStates.length > 0
    ) {
      notFiltering = false;
      filtersPassed = false;
      const states = system.pending_states;

      for (const state of filters.pendingStates) {
        if (
          states.includes(state) ||
          (state === 'None' && (
            !states ||
            states.length === 0 ||
            !states[0]
          ))
        ) {
          filtersPassed = true;
          break;
        }
      }
    }

    if (
      (notFiltering || filtersPassed) &&
      activeFilterKeys.includes('recoveringStates') &&
      filters.recoveringStates.length > 0
    ) {
      notFiltering = false;
      filtersPassed = false;
      const states = system.recovering_states;

      for (const state of filters.recoveringStates) {
        if (
          states.includes(state) ||
          (state === 'None' && (
            !states ||
            states.length === 0 ||
            !states[0]
          ))
        ) {
          filtersPassed = true;
          break;
        }
      }
    }

    if (
      (notFiltering || filtersPassed) &&
      activeFilterKeys.includes('factionInfluence') &&
      filters.factionInfluence.length === 2
    ) {
      notFiltering = false;
      filtersPassed = true;
      const [ min, max ] = filterRange(filters.factionInfluence);
      const influence = system.faction_influence * 100;

      if (min !== '' && influence < min) {
        filtersPassed = false;
      }

      if (filtersPassed && max !== '' && influence > max) {
        filtersPassed = false;
      }
    }

    if (notFiltering || filtersPassed) {
      filteredSystems.push(system);
    }
  }

  return filteredSystems;
}

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

function ValueOrNull({
  value, nullValue = null, nullText = '-',
  centerText = false, displayValue, className = ''
}) {
  const additionalClasses = centerText
    ? ' inline-block w-full text-center'
    : '';

  if (value === nullValue) {
    return (
      <span className={`italic dark:text-neutral-500${additionalClasses}`}>
        {nullText}
      </span>
    );
  }
  
  return (
    <span className={className + additionalClasses}>
      {displayValue === undefined ? value : displayValue}
    </span>
  );
}

function NumberOrNull({
  value, nullValue = -1, centerText = true,
  format = '0.00', prefix = null, suffix = null,
  ...rest
}) {
  return <ValueOrNull
    value={value}
    nullValue={nullValue}
    centerText={centerText}
    displayValue={(
      <>{prefix}{numeral(value).format(format)}{suffix}</>
    )}
    {...rest}
  />;
}

export function useSystemsColumnDefinitions(columns, { shortenedPowers }) {
  const navigate = useNavigate();
  const factionData = useContext(FactionDatasetContext);

  return useMemo(() => {
    const definitions = [];

    for (const column of columns) {
      switch (column) {
        case 'Name':
          definitions.push({
            accessorKey: 'name',
            header: 'System',
            cell: info => {
              const system = info.getValue();

              return (
                <span className="inline-flex w-full items-center gap-1">
                  <span
                    className={[
                      'cursor-pointer transition duration-100',
                      'dark:text-lime-600 dark:hover:text-lime-400'
                    ].join(' ')}
                    onClick={() => navigate({ search: { system }})}
                  >
                    {system}
                  </span>
                  <ToClipboard text={system} title="Copy system name" />
                </span>
              );
            }
          });
          break;

        case 'Influence':
          definitions.push({
            accessorFn: row => Math.round(row.faction_influence * 10000) / 100,
            header: 'Influence',
            meta: {
              filterVariant: 'range',
              alignHeader: 'center'
            },
            cell: info => (
              <span className="inline-flex items-center w-full text-center">
                {info.row.original.is_faction_influence_close && (
                  <>
                    <ExclamationCircleIcon
                      className="size-4 mr-0.5"
                      title="Faction influence close to another"
                    />
                    {numeral(info.getValue()).format('0.00')}%
                  </>
                )}
                {!info.row.original.is_faction_influence_close && (
                  <span className="pl-4 ml-0.5">
                    {numeral(info.getValue()).format('0.00')}%
                  </span>
                )}
              </span>
            )
          });
          break;

        case 'Controlling power':
          definitions.push({
            accessorFn: row => {
              const controlling = row.power_play.controlling;

              return controlling === null
                ? 'None'
                : controlling;
            },
            header: 'Controlling power',
            cell: info => {
              const power = info.getValue();

              return (
                power === 'None'
                  ? <ValueOrNull value={null} />
                  : <PowerName name={power} short={shortenedPowers} />
              );
            }
          });
          break;

        case 'Controlling faction':
          definitions.push({
            accessorFn: row => {
              const controlling = row.controlling_faction;

              return controlling === null
                ? 'None'
                : controlling;
            },
            header: 'Controlling faction',
            cell: info => {
              const faction = info.getValue();
              const className = faction === factionData.faction
                ? 'text-amber-400'
                : '';

              return <ValueOrNull className={className} value={faction} nullValue="None" />;
            }
          });
          break;

        case 'Power state':
          definitions.push({
            accessorKey: 'power_play.state',
            header: 'Power state'
          });
          break;

        case 'Government':
          definitions.push({
            accessorKey: 'government',
            header: 'Government'
          });
          break;

        case 'Allegiance':
          definitions.push({
            accessorKey: 'allegiance',
            header: 'Allegiance'
          });
          break;

        case 'Population':
          definitions.push({
            accessorKey: 'population',
            header: 'Population',
            meta: {
              filterVariant: 'range',
              alignHeader: 'center'
            },
            cell: info => {
              return (
                <span className="inline-block w-full text-center">
                  {numeral(info.getValue()).format('0,0')}
                </span>
              );
            }
          });
          break;

        case 'Body count':
          definitions.push({
            accessorKey: 'body_count',
            header: 'Body count',
            meta: {
              filterVariant: 'range',
              alignHeader: 'center'
            },
            cell: info => {
              return (
                <span className="inline-block w-full text-center">
                  {info.getValue()}
                </span>
              );
            }
          });
          break;

        case 'Security':
          definitions.push({
            accessorKey: 'security',
            header: 'Security'
          });
          break;

        case 'Primary economy':
          definitions.push({
            accessorKey: 'primary_economy',
            header: 'Primary economy'
          });
          break;

        case 'Secondary economy':
          definitions.push({
            accessorKey: 'secondary_economy',
            header: 'Secondary economy'
          });
          break;

        case 'Key system':
          definitions.push({
            accessorKey: 'is_key_system',
            header: 'Key system',
            enableColumnFilter: false,
            meta: {
              alignHeader: 'center'
            },
            cell: info => {
              const isKeySystem = info.getValue();

              return (
                <span className="inline-flex w-full justify-center items-start relative overflow-hidden h-3 -z-10">
                  {isKeySystem && <CheckIcon className="size-5 fill-lime-400 -mt-1" />}
                  {!isKeySystem && <XMarkIcon className="size-5 fill-rose-700 -mt-1" />}
                </span>
              );
            }
          });
          break;

        case 'Influence close':
          definitions.push({
            accessorKey: 'is_faction_influence_close',
            header: 'Influence close',
            enableColumnFilter: false,
            meta: {
              alignHeader: 'center'
            },
            cell: info => {
              const isClose = info.getValue();

              return (
                <span className="inline-flex w-full justify-center items-start relative overflow-hidden h-3">
                  {isClose && <CheckIcon className="size-5 fill-lime-400 -mt-1" />}
                  {!isClose && <XMarkIcon className="size-5 fill-rose-700 -mt-1" />}
                </span>
              );
            }
          });
          break;

        case 'Active states':
          definitions.push({
            accessorKey: 'active_states',
            header: 'Active states',
            cell: info => {
              return info.getValue().join(', ');
            },
            enableColumnFilter: false
          });
          break;

        case 'Pending states':
          definitions.push({
            accessorKey: 'pending_states',
            header: 'Pending states',
            cell: info => {
              return info.getValue().join(', ');
            },
            enableColumnFilter: false
          });
          break;

        case 'Recovering states':
          definitions.push({
            accessorKey: 'recovering_states',
            header: 'Recovering states',
            cell: info => {
              return info.getValue().join(', ');
            },
            enableColumnFilter: false
          });
          break;

        case 'Last update':
          definitions.push({
            accessorFn: row => new Date(row.updated_at),
            header: 'Last update',
            cell: info => {
              const date = info.getValue();

              return (
                <span title={dateTimeText(date, true)}>
                  <DateTimeText date={date} />
                </span>
              );
            },
            enableColumnFilter: false
          });
          break;

        case 'Control progress':
          definitions.push({
            accessorFn: row => {
              const progress = row.power_play.control_progress;

              if (progress === null) {
                return -1;
              }

              return Math.round(progress * 10000) / 100
            },
            header: 'Control progress',
            meta: {
              filterVariant: 'range',
              alignHeader: 'center'
            },
            cell: info => <NumberOrNull value={info.getValue()} format="0.00" suffix="%" />
          });
          break;

        case 'Reinforcement':
          definitions.push({
            accessorFn: row => {
              const reinforcement = row.power_play.reinforcement;

              return reinforcement === null ? -1 : reinforcement;
            },
            header: 'Reinforcement',
            meta: {
              filterVariant: 'range',
              alignHeader: 'center'
            },
            cell: info => <NumberOrNull value={info.getValue()} format="0,0" />
          });
          break;

        case 'Undermining':
          definitions.push({
            accessorFn: row => {
              const undermining = row.power_play.undermining;

              return undermining === null ? -1 : undermining;
            },
            header: 'Undermining',
            meta: {
              filterVariant: 'range',
              alignHeader: 'center'
            },
            cell: info => <NumberOrNull value={info.getValue()} format="0,0" />
          });
          break;

        case 'Conflict progress':
          definitions.push({
            accessorFn: row => {
              const progress = row.power_play.conflict_progress;

              if (progress === null) {
                return -1;
              }

              return Math.round(progress * 10000) / 100
            },
            header: 'Conflict progress',
            meta: {
              filterVariant: 'range',
              alignHeader: 'center'
            },
            cell: info => <NumberOrNull value={info.getValue()} format="0.00" suffix="%" />
          });
          break;

        case 'Conflict powers':
          definitions.push({
            accessorFn: row => {
              let conflicts = row.power_play.conflicts;

              if (conflicts === null || conflicts.length < 2) {
                return -1;
              }

              conflicts = conflicts.sort((a, b) => b.progress - a.progress);

              return Math.round(conflicts[0].progress * 10000) / 100;
            },
            header: 'Conflict powers',
            meta: {
              filterVariant: 'range',
              alignHeader: 'center'
            },
            cell: info => {
              const leadingProgress = info.getValue();

              if (leadingProgress === -1) {
                return (
                  <ValueOrNull value={null} centerText />
                );
              }

              const powers = info.row.original.power_play.conflicts.sort((a, b) => b.progress - a.progress);

              return (
                <div className="grid grid-cols-2 items-center gap-1">
                  <PowerName name={powers[0].name} short={shortenedPowers} className="text-right" />
                  <span className="text-sm">{numeral(powers[0].progress).format('0.00%')}</span>
                  <PowerName name={powers[1].name} short={shortenedPowers} className="text-right" />
                  <span className="text-sm dark:text-neutral-400">{numeral(powers[1].progress).format('0.00%')}</span>
                </div>
              );
            }
          });
          break;

        default:
      }
    }

    return definitions;
  }, [ columns, shortenedPowers ]);
}

export const availableSystemGroups = [
  'None', 'Controlling power', 'Faction priority'
];

function useSystemFilters({ stats, systems }) {
  const filterOptions = useMemo(() => {
    const filterOptions = {
      keySystems: [ true, false ],
      influenceClose: [ true, false ],
      factionInfluence: [ 0, 100 ]
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
