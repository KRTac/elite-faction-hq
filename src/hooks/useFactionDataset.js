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

export function useCreateFactionDataset(dataset) {
  return useMemo(() => {
    return createFactionDataset(dataset ?? {});
  }, [ dataset ]);
}

function useFactionDataset() {
  return useContext(FactionDatasetContext);
}

export default useFactionDataset;
