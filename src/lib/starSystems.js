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

export function combineMapData(datasets) {
  const existing = [];
  const systems = [];
  const categories = {};
  let groupIdx = 0;
  const groups = {}

  for (const dataset of datasets) {
    if (!categories[dataset.faction]) {
      categories[dataset.faction] = {};
      groups[dataset.faction] = groupIdx++;
    }

    const idx = groups[dataset.faction];

    const keySystemsId = 1 + idx * 10;
    const controlledId = 2 + idx * 10;
    const uncontrolledId = 3 + idx * 10;
    const coloniesId = 4 + idx * 10;
    let hasKey = false;
    let hasControlled = false;
    let hasUncontrolled = false;
    let hasColonies = false;

    for (const system of dataset.systems) {
      if (!existing.includes(system.name)) {
        systems.push({
          name: system.name,
          coords: system.coords,
          cat: []
        });
        existing.push(system.name);
      }

      const target = systems.find(s => s.name === system.name);

      if (system.is_key_system && !target.cat.includes(keySystemsId)) {
        target.cat.push(keySystemsId);
        hasKey = true;
      } else if (system.is_controlling_faction && !target.cat.includes(controlledId)) {
        target.cat.push(controlledId);
        hasControlled = true;
      } else if (!target.cat.includes(uncontrolledId)) {
        target.cat.push(uncontrolledId);
        hasUncontrolled = true;
      }

      if (
        (system.is_colonised || system.is_being_colonised) &&
        !target.cat.includes(coloniesId)
      ) {
        target.cat.push(coloniesId);
        hasColonies = true;
      }
    }

    if (hasKey) {
      categories[dataset.faction][keySystemsId] = {
        name: 'Key systems',
        color: 'f54900'
      };
    }

    if (hasControlled) {
      categories[dataset.faction][controlledId] = {
        name: 'Controlled',
        color: '7ccf00'
      };
    }

    if (hasUncontrolled) {
      categories[dataset.faction][uncontrolledId] = {
        name: 'Uncontrolled',
        color: '74d4ff'
      };
    }

    if (hasColonies) {
      categories[dataset.faction][coloniesId] = {
        name: 'Colonies',
        color: 'cccccc'
      };
    }
  }

  return { categories, systems };
}

export function comparisonDisplayGroups(comparison, primarySystems, secondarySystems) {
  const {
    influenceChanged,
    controllingFactionChanged,
    colonisationFinished,
    newSystems, removedSystems
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

  if (influenceChanged.length) {
    groups.push({
      name: 'Influence changed',
      systemNames: influenceChanged,
      systems: primarySystems.filter(s => influenceChanged.includes(s.name))
    });
  }

  if (controllingFactionChanged.length) {
    groups.push({
      name: 'Controlling faction changed',
      systemNames: controllingFactionChanged,
      systems: primarySystems.filter(s => controllingFactionChanged.includes(s.name))
    });
  }

  if (colonisationFinished.length) {
    groups.push({
      name: 'Colonisation finished',
      systemNames: colonisationFinished,
      systems: primarySystems.filter(s => colonisationFinished.includes(s.name))
    });
  }

  return groups;
}
