import { subDays, parseISO, isValid } from 'date-fns';
import { trimSlashes } from './string';
import { systemsStats } from './starSystems';


export function datasetUrl(factionDirectory, datasetName) {
  let dataRoot = import.meta.env.VITE_FACTION_DATA_CLIENT_ROOT;

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
    throw new Error('Specified faction doesn\'t exist.');
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
    throw new Error('Can\'t lookup previous faction for non-existing reference.');
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
  } catch (ex) {
    throw new Error('Requested faction data doesn\'t exist.');
  }

  try {
    return await resp.json();
  } catch (ex) {
    throw new Error('Requested faction data not in the correct format.');
  }
}

export function createFactionDataset(dataset) {
  const {
    timestamp, import_duration, faction,
    inara_faction_id, origin_system, systems
  } = dataset;

  const stats = systemsStats(systems ?? []);

  return {
    isSet: !!timestamp,
    timestamp, faction,
    importDuration: import_duration,
    inaraFactionId: inara_faction_id,
    originSystem: origin_system,
    systems: stats.proccessedSystems,
    stats
  };
}

export function compareDatasets(primary, secondary) {
  return {
    
  };
}
