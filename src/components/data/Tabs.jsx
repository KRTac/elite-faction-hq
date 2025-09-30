import { Tab, TabGroup, TabList, TabPanel as TabPanelNative, TabPanels } from '@headlessui/react';


export function TabPanel({ children }) {
  return (
    <TabPanelNative className="rounded-xl bg-white/5 p-3">
      {children}
    </TabPanelNative>
  );
}

function Tabs({ data, children, activeTabs = [] }) {
  return (
    <TabGroup>
      <TabList className="flex gap-4">
        {data.map(({ title, filters }) => {
          let isActive = false;

          if (filters) {
            for (const filter of filters) {
              if (activeTabs.includes(filter)) {
                isActive = true;

                break;
              }
            }
          }

          return (
            <Tab
              key={title}
              className={[
                'rounded-full px-3 py-1 text-sm/6 font-semibold transition duration-200',
                'focus:not-data-focus:outline-none data-focus:outline',
                isActive
                  ? 'dark:text-accent-d dark:data-hover:text-lime-300'
                  : 'dark:text-neutral-300 dark:data-hover:text-neutral-100',
                'dark:data-focus:outline-neutral-300',
                'dark:data-hover:bg-white/5 dark:data-selected:bg-white/10',
                'dark:data-selected:data-hover:bg-white/10'
              ].join(' ')}
            >
              {title}
            </Tab>
          );
        })}
      </TabList>
      <TabPanels className="mt-3">
        {children}
      </TabPanels>
    </TabGroup>
  );
}

export default Tabs;
