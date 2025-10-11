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

export function useCreateFactionDataset(dataset, faction) {
  return useMemo(() => {
    return createFactionDataset(dataset ?? {}, faction);
  }, [ dataset, faction ]);
}

function useFactionDataset() {
  return useContext(FactionDatasetContext);
}

export default useFactionDataset;
