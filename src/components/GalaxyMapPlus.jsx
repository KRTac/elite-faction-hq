import { useMemo } from 'react';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import useStorageState from 'use-storage-state';
import { availableReferenceCategories, availableReferenceOptions, generateMapData } from '../lib/ed3d';
import GalaxyMap from './GalaxyMap';
import { AdjustmentsVerticalIcon } from '@heroicons/react/24/solid';
import FilterBox from './inputs/FilterBox';
import { mapReferenceSystems } from '../lib/elite';


function GalaxyMapPlus({ groupBy, groups }) {
  const [ refCategoryStates, setRefCategoryStates ] = useStorageState('systemsMap_refCategoryStates', {
    defaultValue: {
      'Notable': {
        active: true,
        selected: [ 'Achenar', 'Alioth', 'Shinrarta Dezhra', 'Sol' ]
      },
      'Power HQs': {
        active: true,
        selected: []
      },
      'Ship engineers': {
        active: true,
        selected: []
      }
    },
    sync: false
  });

  const mapData = useMemo(
    () => {
      const categories = {};
      categories[groupBy] = groups;

      categories['Reference systems'] = [];
      let hasReferences = false;

      for (const cat of Object.keys(refCategoryStates)) {
        const { active, selected } = refCategoryStates[cat];

        if (active && selected && selected.length > 0) {
          hasReferences = true;
          const group = {
            name: cat,
            systems: mapReferenceSystems.filter(s => selected.includes(s.name))
          };
          categories['Reference systems'].push(group);
        }
      }

      if (!hasReferences) {
        delete categories['Reference systems'];
      }

      return generateMapData(categories);
    },
    [ groupBy, groups, refCategoryStates ]
  );

  return (
    <div className="relative h-full">
      <GalaxyMap data={mapData} />
      <div className="absolute bottom-0 right-0 mr-3 mb-3">
        <Popover>
          <PopoverButton
            className={[
              'block size-8 cursor-pointer p-1',
              'focus:outline-none data-focus:outline transition duration-200',
              'rounded-lg border-[1px]',
              'opacity-60 data-hover:opacity-100 data-active:opacity-100',
              'dark:text-neutral-300 dark:data-active:text-lime-500',
              'dark:border-neutral-300 dark:data-active:border-neutral-300',
              'dark:data-focus:outline-white dark:data-hover:border-neutral-300',
              'dark:data-hover:bg-neutral-900/75 dark:data-active:bg-neutral-900!'
            ].join(' ')}
          >
            <AdjustmentsVerticalIcon />
          </PopoverButton>
          <PopoverPanel
            transition
            anchor="top"
            className={[
              'w-full md:w-2xl lg:w-3xl rounded-lg dark:bg-neutral-800/85',
              'transition duration-200 ease-in-out',
              'text-sm/6 [--anchor-gap:--spacing(2)]',
              'data-closed:-translate-y-1 data-closed:opacity-0'
            ].join(' ')}
          >
            <div className="pl-2 pt-2 flex flex-wrap xs:flex-nowrap gap-1">
              <div className="flex-1">
                <p className="dark:text-neutral-300 text-base/5 pb-2 pr-2">Reference systems</p>
                <div className="flex flex-wrap justify-center items-start">
                  {availableReferenceCategories.map(cat => (
                    <div
                      key={cat}
                      className="min-w-66 max-w-96 basis-1/2 grow md:min-w-auto md:grow-0 md:basis-1/2 pr-2 pb-2"
                    >
                      <FilterBox
                        label={cat}
                        value={refCategoryStates[cat].selected}
                        options={availableReferenceOptions[cat]}
                        isActive={refCategoryStates[cat].active && refCategoryStates[cat].selected.length > 0}
                        set={v => setRefCategoryStates({ ...refCategoryStates, [cat]: {
                          active: refCategoryStates[cat].active,
                          selected: v
                        }})}
                        reset={() => setRefCategoryStates({ ...refCategoryStates, [cat]: {
                          active: refCategoryStates[cat].active,
                          selected: []
                        }})}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </PopoverPanel>
        </Popover>
      </div>
    </div>
  );
}

export default GalaxyMapPlus;
