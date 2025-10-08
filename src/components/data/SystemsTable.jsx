import { useMemo } from 'react';
import useStorageState from 'use-storage-state';
import Table from './Table';
import Switch from '../inputs/Switch';


function renderNumOfSystems(rowCount) {
  return <><strong>{rowCount}</strong> systems filtered</>;
}

function SystemsTable({ groupId, label, systems, columns, withRowCount }) {
  const [ showTable, setShowTable ] = useStorageState(
    `systemsTable_${groupId}_show`,
    {
      defaultValue: true,
      sync: false
    }
  );
  const [ columnFilters, setColumnFilters ] = useStorageState(
    `systemsTable_${groupId}_filters`,
    {
      defaultValue: [],
      sync: false
    }
  );
  const [ initialPageSize, storePageSize ] = useMemo(() => {
    const key = `systemsTable_${groupId}_pageSize`;

    return [
      localStorage.getItem(key) ?? 25,
      size => localStorage.setItem(key, size)
    ];
  }, [ groupId ]);

  return (
    <div
      className={[
        label && showTable ? 'mb-10' : 'mb-5'
      ].join(' ')}
    >
      {label && (
        <div className="flex flex-row items-center mb-1 px-3 py-2 rounded-md dark:bg-neutral-700/20">
          <Switch checked={showTable} onChange={() => setShowTable(!showTable)} />
          <p className="dark:text-neutral-300 font-bold text-xl ml-2">{label}</p>
        </div>
      )}
      {showTable && !!systems.length && (
        <Table
          renderNumberOfRows={renderNumOfSystems}
          data={systems}
          columns={columns}
          columnFilters={columnFilters}
          setColumnFilters={setColumnFilters}
          resetFilters={() => setColumnFilters([])}
          withRowCount={withRowCount}
          initialPageSize={initialPageSize}
          onPerPageUpdate={storePageSize}
        />
      )}
    </div>
  );
}

export default SystemsTable;
