import { createContext, useContext } from 'react';


export const FactionsMetaContext = createContext(null);

function useFactionsMeta() {
  return useContext(FactionsMetaContext);
}

export default useFactionsMeta;
