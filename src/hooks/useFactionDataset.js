import { useMemo, createContext, useContext } from 'react';
import { createFactionDataset } from '../lib/factionDataset';


export const FactionDatasetContext = createContext(null);

export function useSystemByName(systemName) {
  const { systems } = useContext(FactionDatasetContext);
  const system = useMemo(
    () => systems.find(system => system.name === systemName),
    [ systemName, systems ]
  );

  return system;
}

export function useCombineMapData(datasets) {
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

export function useCreateFactionDataset(dataset) {
  return useMemo(() => {
    return createFactionDataset(dataset ?? {});
  }, [ dataset ]);
}

function useFactionDataset() {
  return useContext(FactionDatasetContext);
}

export default useFactionDataset;
