import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
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
    <div className="ml-2">
      <Menu>
        <MenuButton
          className={[
            'flex justify-center flex-col items-center transition duration-200 px-1',
            'cursor-pointer',
            isActive
              ? 'dark:text-accent-d/85 dark:data-hover:text-accent-d'
              : 'dark:text-neutral-300 dark:data-hover:text-neutral-100',
            'dark:data-active:text-accent-d/85 dark:data-active:data-hover:text-accent-d'
          ].join(' ')}
        >
          <ScaleIcon className="size-6" />
        </MenuButton>
        <MenuItems
          transition
          anchor="bottom center"
          className="w-24 origin-top-right rounded-xl border dark:border-white/5 dark:bg-bg2-d px-1 py-2 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0"
        >
          {[ 0, 1, 7, 10 ].map(d => (
            <MenuItem
              key={`btn-${d}`}
              onClick={() => d === 0 ? setIsActive(false) : fetchDaysOld(d)}
            >
              <button className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10">
                {d === 0 ? 'Off' : `${d} day${d > 1 ? 's' : ''}`}
              </button>
            </MenuItem>
          ))}
        </MenuItems>
      </Menu>
    </div>
  );
}

export default CompareSelector;
