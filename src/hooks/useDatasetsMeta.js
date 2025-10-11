import { createContext, useContext } from 'react';


export const DatasetsMetaContext = createContext(null);

function useDatasetsMeta() {
  return useContext(DatasetsMetaContext);
}

export default useDatasetsMeta;
