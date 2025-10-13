
import numeral from 'numeral';
import { Link } from '@tanstack/react-router';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { ExclamationCircleIcon } from '@heroicons/react/16/solid';
import ToClipboard from '../components/ToClipboard';
import DateTimeText from '../components/data/DateTimeText';
import PowerName from '../components/data/PowerName';
import ValueOrNull from '../components/data/ValueOrNull';
import NumberOrNull from '../components/data/NumberOrNull';
import { dateTimeText } from './string';
import { filterRange } from './input';


function statByOccurrence(set, values, systemName) {
  if (!Array.isArray(values)) {
    values = [ values ];
  }

  if (values.length === 0) {
    values.push(null);
  }

  for (let value of values) {
    let isNew = true;

    if (value === null) {
      value = 'None';
    }

    for (const i in set) {
      if (set[i].value === value) {
        if (!set[i].systems.includes(systemName)) {
          set[i].systems.push(systemName);
        }

        set[i].occurrence += 1;
        isNew = false;

        break;
      }
    }

    if (isNew) {
      set.push({ value, occurrence: 1, systems: [ systemName ] });
    }
  }
}

function occurrenceSort(a, b) {
  return b.occurrence - a.occurrence;
}

export function systemsStats(systems) {
  const powers = [];
  const controllingPowers = [];
  const controllingFactions = [];
  const powerStates = [];

  const activeStates = [];
  const pendingStates = [];
  const recoveringStates = [];

  const governments = [];
  const allegiances = [];

  const primaryEconomies = [];
  const secondaryEconomies = [];
  const securityStates = [];

  let totalPopulation = 0;
  const proccessedSystemNames = [];
  const proccessedSystems = [];

  systems.forEach(system => {
    if (proccessedSystemNames.includes(system.name)) {
      return;
    }

    proccessedSystems.push(system);
    proccessedSystemNames.push(system.name);

    statByOccurrence(powers, system.power_play.powers, system.name);
    statByOccurrence(controllingPowers, system.power_play.controlling, system.name);
    statByOccurrence(controllingFactions, system.controlling_faction, system.name);

    statByOccurrence(powerStates, system.power_play.state, system.name);

    statByOccurrence(activeStates, system.active_states, system.name);
    statByOccurrence(pendingStates, system.pending_states, system.name);
    statByOccurrence(recoveringStates, system.recovering_states, system.name);

    statByOccurrence(governments, system.government, system.name);
    statByOccurrence(allegiances, system.allegiance, system.name);

    statByOccurrence(primaryEconomies, system.primary_economy, system.name);
    statByOccurrence(secondaryEconomies, system.secondary_economy, system.name);
    statByOccurrence(securityStates, system.security, system.name);

    totalPopulation += system.population;
  });

  powers.sort(occurrenceSort);
  controllingPowers.sort(occurrenceSort);
  controllingFactions.sort(occurrenceSort);
  powerStates.sort(occurrenceSort);

  activeStates.sort(occurrenceSort);
  pendingStates.sort(occurrenceSort);
  recoveringStates.sort(occurrenceSort);

  governments.sort(occurrenceSort);
  allegiances.sort(occurrenceSort);

  primaryEconomies.sort(occurrenceSort);
  secondaryEconomies.sort(occurrenceSort);
  securityStates.sort(occurrenceSort);

  return {
    powers,
    controllingPowers,
    controllingFactions,
    powerStates,
    activeStates,
    pendingStates,
    recoveringStates,
    governments,
    allegiances,
    primaryEconomies,
    secondaryEconomies,
    securityStates,
    totalPopulation,
    proccessedSystems
  };
}

export function comparisonDisplayGroups(comparison, primarySystems, secondarySystems) {
  const {
    influenceChanged,
    controllingFactionChanged,
    colonisationFinished,
    newSystems, removedSystems,
    powerChanged, powerStateChanged
  } = comparison;

  const groups = [];

  if (newSystems.length) {
    groups.push({
      name: 'Added systems',
      systemNames: newSystems,
      systems: primarySystems.filter(s => newSystems.includes(s.name))
    });
  }

  if (removedSystems.length) {
    groups.push({
      name: 'Removed systems',
      systemNames: removedSystems,
      systems: secondarySystems.filter(s => removedSystems.includes(s.name))
    });
  }

  if (controllingFactionChanged.length) {
    groups.push({
      name: 'Controlling faction changed',
      systemNames: controllingFactionChanged,
      systems: primarySystems.filter(s => controllingFactionChanged.includes(s.name))
    });
  }

  const powerChangedSystems = Object.keys(powerChanged);
  if (powerChangedSystems.length) {
    groups.push({
      name: 'Controling power changed',
      systemNames: powerChangedSystems,
      systems: primarySystems.filter(s => powerChangedSystems.includes(s.name))
    });
  }

  const powerStateChangedSystems = Object.keys(powerStateChanged);
  if (powerStateChangedSystems.length) {
    groups.push({
      name: 'Power state changed',
      systemNames: powerStateChangedSystems,
      systems: primarySystems.filter(s => powerStateChangedSystems.includes(s.name))
    });
  }

  if (colonisationFinished.length) {
    groups.push({
      name: 'Colonisation finished',
      systemNames: colonisationFinished,
      systems: primarySystems.filter(s => colonisationFinished.includes(s.name))
    });
  }

  const infChangedSystems = Object.keys(influenceChanged);
  if (infChangedSystems.length) {
    groups.push({
      name: 'Influence changed',
      systemNames: infChangedSystems,
      systems: primarySystems.filter(s => infChangedSystems.includes(s.name))
    });
  }

  return groups;
}

export function tableColumnDefinition(
  column,
  {
    shortenedPowers, factionName, comparison
  }
) {
  const { influenceChanged, powerChanged, powerStateChanged } = comparison ?? {};
  let definition;

  switch (column) {
    case 'Name':
      definition = {
        accessorKey: 'name',
        header: 'System',
        cell: info => {
          const system = info.getValue();

          return (
            <span className="inline-flex w-full items-center gap-1">
              <Link
                className={[
                  'cursor-pointer transition duration-100 no-underline',
                  'dark:text-lime-600 dark:hover:text-lime-400'
                ].join(' ')}
                search={{ system }}
              >
                {system}
              </Link>
              <ToClipboard text={system} title="Copy system name" />
            </span>
          );
        }
      };
      break;

    case 'Influence':
      definition = {
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
      };
      break;

    case 'Controlling power':
      definition = {
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
      };
      break;

    case 'Controlling faction':
      definition = {
        accessorFn: row => {
          const controlling = row.controlling_faction;

          return controlling === null
            ? 'None'
            : controlling;
        },
        header: 'Controlling faction',
        cell: info => {
          const faction = info.getValue();
          const className = faction === factionName
            ? 'text-amber-400'
            : '';

          return <ValueOrNull className={className} value={faction} nullValue="None" />;
        }
      };
      break;

    case 'Power state':
      definition = {
        accessorKey: 'power_play.state',
        header: 'Power state'
      };
      break;

    case 'Government':
      definition = {
        accessorKey: 'government',
        header: 'Government'
      };
      break;

    case 'Allegiance':
      definition = {
        accessorKey: 'allegiance',
        header: 'Allegiance'
      };
      break;

    case 'Population':
      definition = {
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
      };
      break;

    case 'Body count':
      definition = {
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
      };
      break;

    case 'Security':
      definition = {
        accessorKey: 'security',
        header: 'Security'
      };
      break;

    case 'Primary economy':
      definition = {
        accessorKey: 'primary_economy',
        header: 'Primary economy'
      };
      break;

    case 'Secondary economy':
      definition = {
        accessorKey: 'secondary_economy',
        header: 'Secondary economy'
      };
      break;

    case 'Key system':
      definition = {
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
      };
      break;

    case 'Influence close':
      definition = {
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
      };
      break;

    case 'Active states':
      definition = {
        accessorKey: 'active_states',
        header: 'Active states',
        cell: info => {
          return info.getValue().join(', ');
        },
        enableColumnFilter: false
      };
      break;

    case 'Pending states':
      definition = {
        accessorKey: 'pending_states',
        header: 'Pending states',
        cell: info => {
          return info.getValue().join(', ');
        },
        enableColumnFilter: false
      };
      break;

    case 'Recovering states':
      definition = {
        accessorKey: 'recovering_states',
        header: 'Recovering states',
        cell: info => {
          return info.getValue().join(', ');
        },
        enableColumnFilter: false
      };
      break;

    case 'Last update':
      definition = {
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
      };
      break;

    case 'Control progress':
      definition = {
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
      };
      break;

    case 'Reinforcement':
      definition = {
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
      };
      break;

    case 'Undermining':
      definition = {
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
      };
      break;

    case 'Conflict progress':
      definition = {
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
      };
      break;

    case 'Conflict powers':
      definition = {
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
      };
      break;

    case 'Influence changed':
      definition = {
        accessorFn: row => Math.round(influenceChanged[row.name] * 10000) / 100,
        header: 'Influence changed',
        meta: {
          filterVariant: 'range',
          alignHeader: 'center'
        },
        cell: info => (
          <span
            className={[
              'inline-block w-full text-center',
              info.getValue() < 0
                ? 'text-red-600'
                : 'text-lime-400'
            ].join(' ')}
          >
            {numeral(info.getValue()).format('0.00')}%
          </span>
        )
      };
      break;

    case 'Controling power changed':
      definition = {
        accessorFn: row => powerChanged[row.name] ?? '',
        header: 'Former power',
        cell: info => {
          const oldPower = info.getValue();

          return (
            oldPower
              ? <PowerName name={oldPower} short={shortenedPowers} />
              : <ValueOrNull value={null} nullText="None" />
          );
        }
      };
      break;

    case 'Power state changed':
      definition = {
        accessorFn: row => powerStateChanged[row.name] ?? '',
        header: 'Former power state'
      };
      break;

    default:
  }

  return definition;
}

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

    if (
      (notFiltering || filtersPassed) &&
      activeFilterKeys.includes('population') &&
      filters.population.length === 2
    ) {
      notFiltering = false;
      filtersPassed = true;
      const [ min, max ] = filterRange(filters.population);
      const population = system.population;

      if (min !== '' && population < min) {
        filtersPassed = false;
      }

      if (filtersPassed && max !== '' && population > max) {
        filtersPassed = false;
      }
    }

    if (notFiltering || filtersPassed) {
      filteredSystems.push(system);
    }
  }

  return filteredSystems;
}
