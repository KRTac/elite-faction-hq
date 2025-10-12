import { createContext, useContext, useMemo } from 'react';
import { isPower } from '../lib/elite';


export const FactionContext = createContext(null);

export function useCreateFaction(faction) {
  return useMemo(() => {
    return {
      isPower: isPower(faction.name),
      ...faction
    };
  }, [ faction ]);
}

function useFaction() {
  return useContext(FactionContext);
}

export default useFaction;
