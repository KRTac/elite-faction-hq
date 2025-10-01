import { useMemo, createContext, useContext } from 'react';


export const FactionDatasetContext = createContext(null);

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

function systemStats(systems) {
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

export function useSystemByName(systemName) {
  const { systems } = useContext(FactionDatasetContext);
  const system = useMemo(
    () => systems.find(system => system.name === systemName),
    [ systemName, systems ]
  );

  return system;
}

export function useCreateFactionDataset(dataset) {
  const {
    timestamp, import_duration, faction,
    inara_faction_id, origin_system, systems
  } = dataset;

  const stats = useMemo(() => {
    return systemStats(systems);
  }, [ systems ]);

  return useMemo(() => {
    return {
      timestamp, faction,
      importDuration: import_duration,
      inaraFactionId: inara_faction_id,
      originSystem: origin_system,
      systems: stats.proccessedSystems,
      stats
    };
  }, [
    timestamp, import_duration, faction,
    inara_faction_id, origin_system, stats
  ]);
}

function useFactionDataset() {
  return useContext(FactionDatasetContext);
}

export default useFactionDataset;
