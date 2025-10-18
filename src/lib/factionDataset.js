import { subDays, parseISO, isValid, format } from 'date-fns';
import { trimSlashes } from './string';
import { systemsStats } from './starSystems';
import { isPowerSlug } from './elite';


export function datasetUrl(factionDirectory, datasetName) {
  let dataRoot = import.meta.env.VITE_DATA_CLIENT_ROOT ?? '';

  if (isPowerSlug(factionDirectory)) {
    dataRoot += '/powers'
  } else {
    dataRoot += '/factions'
  }

  if (!dataRoot.startsWith('http://') && !dataRoot.startsWith('https://')) {
    dataRoot = `${import.meta.env.BASE_URL}${trimSlashes(dataRoot)}`;
  }

  return `${dataRoot}/${factionDirectory}/${datasetName}.json`;
}

export function timeQueryToDate(query, refDate) {
  let date = undefined;
  const num = Number(query);

  if (isNaN(num)) {
    if (!query.includes('T')) {
      const now = new Date();
      query += `T${now.getUTCHours()}:${now.getUTCMinutes()}:${now.getUTCSeconds()}`;
    }

    const d = parseISO(query + 'Z');

    if (isValid(d)) {
      date = d;
    }
  } else if (num >= 0) {
    date = subDays(refDate ?? new Date(), num);
  }

  return date;
}

export function dateToName(date) {
  if (typeof date === 'string') {
    date = new Date(date);
  }

  const parts = [
    (date.getUTCMonth() + 1) + '',
    date.getUTCDate() + '',
    date.getUTCHours() + '',
    date.getUTCMinutes() + '',
    date.getUTCSeconds() + ''
  ];

  for (const idx in parts) {
    if (parts[idx].length < 2) {
      parts[idx] = '0' + parts[idx];
    }
  }

  return [
    `${date.getUTCFullYear()}-`,
    `${parts[0]}-`,
    `${parts[1]}T`,
    `${parts[2]}-`,
    `${parts[3]}-`,
    `${parts[4]}Z`,
  ].join('');
}

export function nameToDate(name) {
  const parts = name.split('T');

  return new Date(`${parts[0]}T${parts[1].split('-').join(':')}`);
}

export function closestDataset(date, datasets) {
  const dates = datasets.map(nameToDate);
  let lastDiff = undefined;
  let closest = undefined;

  for (const idx in dates) {
    const diff = Math.abs(dates[idx] - date);

    if (lastDiff !== undefined && diff > lastDiff) {
      closest = datasets[idx - 1];

      break;
    }

    lastDiff = diff;
    closest = datasets[idx];
  }

  return closest;
}

export function urlByTimeQuery(query, factions, fallbackFactionDir) {
  const parts = (query + '').split('/');
  let factionDir = fallbackFactionDir;

  if (parts.length > 2) {
    throw new Error('Invalid dataset query format.');
  } else if (parts.length === 2) {
    factionDir = parts[0];
    query = parts[1];
  }

  const faction = factions.find(({ directory }) => directory === factionDir);

  if (!faction) {
    throw new Error('Specified faction or power doesn\'t exist.');
  }

  let datasetName = faction.datasets[0];

  if (query) {
    const refDate = timeQueryToDate(query);
    datasetName = closestDataset(refDate, faction.datasets);
  }

  return datasetUrl(faction.directory, datasetName);
}

export function previousDataset(current, datasets, daysOld = 0) {
  const currentIdx = datasets.indexOf(current);

  if (currentIdx === -1) {
    throw new Error('Can\'t lookup previous faction or power for non-existing reference.');
  }

  if (currentIdx === datasets.length - 1) {
    return null;
  }

  let targetIdx = currentIdx + 1;

  if (daysOld > 0) {
    const compareDate = timeQueryToDate(daysOld, nameToDate(current));
    const compareName = closestDataset(compareDate, datasets);

    if (current !== compareName) {
      targetIdx = datasets.indexOf(compareName);
    }
  }

  return datasets[targetIdx];
}

export async function fetchDataset(url) {
  let resp;

  try {
    resp = await fetch(url);
  } catch {
    throw new Error('Requested faction or power data doesn\'t exist.');
  }

  try {
    return await resp.json();
  } catch {
    throw new Error('Requested faction or power data not in the correct format.');
  }
}

export function createFactionDataset(dataset, factionDef) {
  if (!dataset) {
    dataset = {};
  }

  const {
    timestamp, import_duration, faction, power,
    inara_faction_id, systems
  } = dataset;
  let { origin_system } = dataset;
  const isSet = !!timestamp;

  if (power) {
    origin_system = factionDef.origin_system;
  }

  const stats = systemsStats(systems ?? []);

  return {
    isSet,
    timestamp, faction, power,
    importDuration: import_duration,
    inaraFactionId: inara_faction_id,
    originSystem: origin_system,
    systems: stats.proccessedSystems,
    stats,
    paginate: paginateDataset(isSet ? dateToName(timestamp) : null, factionDef.datasets)
  };
}

export function compareDatasets(primary, secondary) {
  let newSystems = primary.systems.map(s => s.name);
  let removedSystems = secondary.systems.map(s => s.name);

  const primSysNames = [ ...newSystems ];

  for (const name of primSysNames) {
    if (removedSystems.includes(name)) {
      newSystems = newSystems.filter(n => n !== name);
      removedSystems = removedSystems.filter(n => n !== name);
    }
  }

  const changedSystems = [ ...newSystems, ...removedSystems ];
  const infChangeThreshold = 0.02;
  const influenceChanged = {};
  const controllingFactionChanged = [];
  const colonisationFinished = [];
  const powerChanged = {};
  const powerStateChanged = {};

  for (const system of primary.systems) {
    if (newSystems.includes(system.name) || removedSystems.includes(system.name)) {
      continue;
    }

    const oldSystem = secondary.systems.find(s => s.name === system.name);
    let hasChanged = false;

    if (primary.faction) {
      const inluenceChange = system.faction_influence - oldSystem.faction_influence;

      if (Math.abs(inluenceChange) >= infChangeThreshold) {
        influenceChanged[system.name] = inluenceChange;
        hasChanged = true;
      }

      if (system.is_controlling_faction !== oldSystem.is_controlling_faction) {
        controllingFactionChanged.push(system.name);
        hasChanged = true;
      }
    }

    if (system.is_being_colonised !== oldSystem.is_being_colonised && !system.is_being_colonised) {
      colonisationFinished.push(system.name);
      hasChanged = true;
    }

    if (system.power_play.controlling !== oldSystem.power_play.controlling) {
      powerChanged[system.name] = oldSystem.power_play.controlling;
      hasChanged = true;
    } else if (
      system.power_play.controlling &&
      system.power_play.state !== oldSystem.power_play.state
    ) {
      powerStateChanged[system.name] = oldSystem.power_play.state;
      hasChanged = true;
    }

    if (hasChanged) {
      changedSystems.push(system.name);
    }
  }

  return {
    influenceChanged,
    controllingFactionChanged,
    changedSystems,
    colonisationFinished,
    newSystems, removedSystems,
    powerChanged, powerStateChanged
  };
}

export function paginateDataset(dataset, datasets) {
  let activeIndex = -1;
  let prevDataset;
  let nextDataset;
  
  if (dataset) {
    activeIndex = datasets.indexOf(dataset);
  }

  if (activeIndex !== -1) {
    if (activeIndex > 0) {
      nextDataset = datasets[activeIndex - 1];
    }

    if (activeIndex < datasets.length - 1) {
      prevDataset = datasets[activeIndex + 1];
    }
  }

  return {
    activeIndex,
    prevDataset,
    nextDataset
  };
}

const fileDateFormat = 'yyyy-MM-dd';

export function datasetsForDate(date, datasets) {
  const datePart = format(date, fileDateFormat);

  return datasets.filter(d => d.startsWith(datePart));
}
