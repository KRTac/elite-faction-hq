import { useMemo, createContext, useContext, useState } from 'react';
import useStorageState from 'use-storage-state';
import { compareDatasets } from '../lib/factionDataset';
import { comparisonDisplayGroups } from '../lib/starSystems';


export const DatasetComparisonContext = createContext(null);

export function useCreateDatasetComparison(refDataset, initialDataset = null) {
  const [ isActive, setIsActive ] = useStorageState('systems_comparisonActive', {
    defaultValue: false,
    sync: false
  });
  const [ dataset, setDataset ] = useState(initialDataset);

  return useMemo(() => {
    let result = null;
    let displayGroups = null;

    if (dataset.isSet) {
      result = compareDatasets(refDataset, dataset);
      displayGroups = comparisonDisplayGroups(result, refDataset.systems, dataset.systems);
    }

    return {
      isActive: result ? isActive : false,
      isAvailable: !!result,
      dataset,
      result,
      displayGroups,
      setIsActive,
      setDataset
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ isActive, refDataset, dataset ]);
}

function useDatasetComparison() {
  return useContext(DatasetComparisonContext);
}

export default useDatasetComparison;
