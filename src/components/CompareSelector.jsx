import { Button, Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { ScaleIcon } from '@heroicons/react/24/solid';
import useDatasetComparison from '../hooks/useDatasetComparison';
import { createFactionDataset, datasetUrl, dateToName, fetchDataset, previousDataset } from '../lib/factionDataset';
import useFactionDataset from '../hooks/useFactionDataset';
import useFaction from '../hooks/useFaction';


function CompareSelector() {
  const { datasets, directory } = useFaction();
  const { timestamp } = useFactionDataset();
  const { isActive, setIsActive, setDataset } = useDatasetComparison();

  async function fetchDaysOld(days) {
    localStorage.setItem('compareDataset_daysOld', days);

    if (days > 0) {
      const name = previousDataset(dateToName(timestamp), datasets, days);
      const json = await fetchDataset(datasetUrl(directory, name));

      setDataset(createFactionDataset(json));
      setIsActive(true);
    }
  }

  return (
    <div className="ml-3">
      <Popover>
        <PopoverButton
          className={[
            'flex justify-center flex-col items-center px-1 transition duration-200 w-13',
            'cursor-pointer',
            isActive
              ? 'dark:data-active:text-accent-d/75 dark:data-active:data-hover:text-accent-d'
              : 'dark:text-neutral-400 dark:data-hover:text-neutral-200',
            'dark:data-active:text-accent-d/75 dark:data-active:data-hover:text-accent-d'
          ].join(' ')}
        >
          <ScaleIcon className="size-6" />
        </PopoverButton>
        <PopoverPanel
          transition
          anchor="bottom"
          className="rounded-xl dark:bg-bg-d/85 text-sm/6 transition duration-200 ease-in-out [--anchor-gap:--spacing(2)] data-closed:-translate-y-1 data-closed:opacity-0 z-10"
        >
          <div className="p-3">
            {[ 0, 1, 7, 10 ].map(d => (
              <Button
                key={`btn-${d}`}
                className="block text-right min-w-20 rounded-lg px-3 py-2 transition dark:hover:bg-white/5 dark:text-neutral-300"
                onClick={() => d === 0 ? setIsActive(false) : fetchDaysOld(d)}
              >
                {d === 0 ? 'Off' : `${d} day${d > 1 ? 's' : ''}`}
              </Button>
            ))}
          </div>
        </PopoverPanel>
      </Popover>
    </div>
  );
}

export default CompareSelector;
