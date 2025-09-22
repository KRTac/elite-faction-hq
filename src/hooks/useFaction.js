import { createContext, useContext } from 'react';


export const FactionContext = createContext(null);

function useFaction() {
  return useContext(FactionContext);
}

export default useFaction;
