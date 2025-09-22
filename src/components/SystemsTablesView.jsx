import { useState } from 'react';
import useStorageState from 'use-storage-state';
import { Cog6ToothIcon } from '@heroicons/react/20/solid';
import SystemsTableGroup from './data/SystemsTableGroup';
import { useSystemsColumnDefinitions } from '../hooks/useSystemFilters';
import Switch from './inputs/Switch';
import IconButton from './inputs/IconButton';


const selectableColumns = [
  'Controlling faction', 'Controlling power', 'Power state',
  'Government', 'Allegiance', 'Population', 'Body count',
  'Security', 'Primary economy', 'Secondary economy', 'Key system',
  'Influence', 'Active states', 'Pending states', 'Recovering states',
  'Last update', 'Control progress', 'Reinforcement', 'Undermining',
  'Influence close', 'Conflict power', 'Conflict progress'
];

function SystemsTablesView({ systems, groups }) {
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
  const columnDefinitions = useSystemsColumnDefinitions(tableColumns);

  let otherSystems = [];

  if (groups.length) {

  } else {
    otherSystems = systems;
  }

  return (
    <div className="px-3">
      <div className="pb-2 flex flex-row-reverse items-start">
        <IconButton
          onClick={() => setShowSettings(!showSettings)}
          title="Toggle settings"
          as={Cog6ToothIcon}
        />
        {showSettings && (
          <div className="flex flex-col items-end gap-4 mr-3 mb-1">
            <Switch
              checked={showRowCount}
              onChange={() => {
                setShowRowCount(!showRowCount);
              }}
            >
              Row numbers
            </Switch>
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
      {!otherSystems.length && !groups.length && (
        <p className="text-center italic text-neutral-400 text-xl py-5">No systems found</p>
      )}
      {!!otherSystems.length && (
        <SystemsTableGroup
          groupId="others"
          label={!!groups.length ? 'Uncategorized' : ''}
          systems={otherSystems}
          columns={columnDefinitions}
          withRowCount={showRowCount}
        />
      )}
    </div>
  );
}

export default SystemsTablesView;
