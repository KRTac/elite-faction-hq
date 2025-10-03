import { useMemo, createContext, useContext, useState } from 'react';


export const DatasetComparisonContext = createContext(null);

export function useCreateDatasetComparison(refDataset, initialDataset = null) {
  const [ isActive, setIsActive ] = useState(!!initialDataset);
  const [ dataset, setDataset ] = useState(initialDataset);

  return useMemo(() => {
    let comparison = null;

    if (dataset.isSet) {
      comparison = compareDatasets(refDataset, dataset);
    }

    return {
      isActive,
      isAvailable: dataset.isSet,
      dataset,
      comparison,
      setIsActive,
      setDataset
    };
  }, [ isActive, refDataset, dataset ]);
}

function useDatasetComparison() {
  return useContext(DatasetComparisonContext);
}

export default useDatasetComparison;
