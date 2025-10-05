import { useState } from 'react';
import useStorageState from 'use-storage-state';
import { Cog6ToothIcon } from '@heroicons/react/20/solid';
import SystemsTable from './data/SystemsTable';
import { useSystemsColumnDefinitions } from '../hooks/useSystemFilters';
import Switch from './inputs/Switch';
import IconButton from './inputs/IconButton';
import PowerName from './data/PowerName';


const selectableColumns = [
  'Controlling faction', 'Controlling power', 'Power state',
  'Government', 'Allegiance', 'Population', 'Body count',
  'Security', 'Primary economy', 'Secondary economy', 'Key system',
  'Influence', 'Active states', 'Pending states', 'Recovering states',
  'Last update', 'Control progress', 'Reinforcement', 'Undermining',
  'Influence close', 'Conflict powers'
];

function SystemsTablesView({ groups, emptyText = 'No systems found' }) {
  const [ showSettings, setShowSettings ] = useState(false);
  const [ tableColumns, setTableColumns ] = useStorageState('systemsTables_columns', {
    defaultValue: [
      'Name', 'Controlling faction', 'Controlling power', 'Key system', 'Influence', 'Last update'
    ],
    sync: false
  });
  const [ showRowCount, setShowRowCount ] = useStorageState('systemsTables_showRowCount', {
    defaultValue: true,
    sync: false
  });
  const [ shortenedPowers, setShortenedPowers ] = useStorageState('systemsTables_shortenedPowers', {
    defaultValue: false,
    sync: false
  });
  const columnDefinitions = useSystemsColumnDefinitions(tableColumns, { shortenedPowers });

  const tableGroups = [];

  if (groups.length) {
    if (groups.length === 1 && groups[0].name === 'Systems') {
      tableGroups.push({ label: '', systems: groups[0].systems });
    } else {
      for (const group of groups) {
        tableGroups.push({ label: group.name, systems: group.systems });
      }
    }
  }

  return (
    <div className="px-3">
      <div className="pb-2 flex flex-row-reverse items-start">
        <IconButton
          onClick={() => setShowSettings(!showSettings)}
          title="Toggle settings"
          as={Cog6ToothIcon}
          isActive={showSettings}
        />
        {showSettings && (
          <div className="flex flex-col items-end gap-4 mr-3 mt-2 mb-5">
            <div className="flex flex-wrap gap-2.5">
              <Switch
                checked={showRowCount}
                onChange={() => {
                  setShowRowCount(!showRowCount);
                }}
              >
                Row numbers
              </Switch>
              <Switch
                checked={shortenedPowers}
                onChange={() => {
                  setShortenedPowers(!shortenedPowers);
                }}
              >
                Short Power names
              </Switch>
            </div>
            <ul className="flex gap-2 flex-wrap justify-end">
              {selectableColumns.map(column => {
                const isActive = tableColumns.includes(column);

                return (
                  <li
                    key={column}
                    role="button"
                    aria-label="Toggle column visibility"
                    className={[
                      'text-sm flex gap-1 items-center cursor-pointer',
                      isActive ? 'dark:text-lime-600' : 'dark:text-neutral-400'
                    ].join(' ')}
                    onClick={() => setTableColumns(isActive
                      ? tableColumns.filter(c => c !== column)
                      : [ ...tableColumns, column ]
                    )}
                  >
                    <input type="checkbox" checked={isActive} readOnly />
                    {column}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
      {!tableGroups.length && (
        <p className="text-center italic text-neutral-400 text-xl py-5">{emptyText}</p>
      )}
      {tableGroups.map(({ label, systems }) => {
        let labelEl = '';

        if (label) {
          labelEl = (
            <>
              <PowerName name={label} />
              <span className="dark:text-stone-400 text-base">{` - ${systems.length}`}</span>
            </>
          );
        }

        return (
          <SystemsTable
            key={label || '_uncategorized'}
            groupId={label || 'uncategorized'}
            label={labelEl}
            systems={systems}
            columns={columnDefinitions}
            withRowCount={showRowCount}
          />
        );
      })}
    </div>
  );
}

export default SystemsTablesView;
