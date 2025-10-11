import { createContext, useContext } from 'react';


export const PowersMetaContext = createContext(null);

function usePowersMeta() {
  return useContext(PowersMetaContext);
}

export default usePowersMeta;
