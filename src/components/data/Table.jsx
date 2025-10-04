import { useMemo, useState } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { MagnifyingGlassIcon, ArrowPathIcon, ChevronDownIcon } from '@heroicons/react/16/solid';
import Input from '../inputs/Input';
import DebouncedInput from '../inputs/DebouncedInput';


function Filter({ column }) {
  const uniqueFilterId = useState(crypto.randomUUID().split('-')[0])[0];

  const { filterVariant, alignHeader } = column.columnDef.meta ?? {};

  const columnFilterValue = column.getFilterValue();

  const sortedUniqueValues = useMemo(() => {
    return filterVariant === 'range'
      ? []
      : Array.from(column.getFacetedUniqueValues().keys())
          .sort()
          .slice(0, 5000);
  }, [ column.getFacetedUniqueValues(), filterVariant ]);

  if (filterVariant === 'range') {
    return (
      <div>
        <div
          className={`flex gap-1${alignHeader === 'center' ? ' justify-center' : ''}`}
        >
          <DebouncedInput
            type="number"
            min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
            max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
            value={columnFilterValue?.[0] ?? ''}
            onChange={value =>
              column.setFilterValue(old => [value, old?.[1]])
            }
            placeholder={`Min ${
              column.getFacetedMinMaxValues()?.[0] !== undefined
                ? `(${column.getFacetedMinMaxValues()?.[0]})`
                : ''
            }`}
            className="w-14 border shadow rounded"
          />
          <DebouncedInput
            type="number"
            min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
            max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
            value={columnFilterValue?.[1] ?? ''}
            onChange={value =>
              column.setFilterValue(old => [old?.[0], value])
            }
            placeholder={`Max ${
              column.getFacetedMinMaxValues()?.[1]
                ? `(${column.getFacetedMinMaxValues()?.[1]})`
                : ''
            }`}
            className="w-14 border shadow rounded"
          />
        </div>
        <div className="h-1" />
      </div>
    );
  }

  if (filterVariant === 'select') {
    return (
      <select
        onChange={e => column.setFilterValue(e.target.value)}
        value={columnFilterValue?.toString()}
      >
        <option value="">All</option>
        {sortedUniqueValues.map(value => (
          <option value={value} key={value}>
            {value}
          </option>
        ))}
      </select>
    );
  }

  const datalistId = `${column.id}_list_${uniqueFilterId}`;

  return (
    <>
      <datalist id={datalistId}>
        {sortedUniqueValues.map(value => (
          <option value={value} key={value} />
        ))}
      </datalist>
      <DebouncedInput
        type="text"
        value={columnFilterValue ?? ''}
        onChange={value => column.setFilterValue(value)}
        placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
        className="max-w-36 w-full border shadow rounded px-1 py-0.5"
        list={datalistId}
      />
      <div className="h-1" />
    </>
  );
}

function defaultNumOfRows(rowCount) {
  return (
    <>
      <strong>{rowCount}</strong> rows
    </>
  );
}

function Table({
  data, columns, renderNumberOfRows = defaultNumOfRows,
  columnFilters, setColumnFilters, resetFilters,
  withRowCount = false, initialPageSize = 25, onPerPageUpdate
}) {
  const [ inactiveFilters, setInactiveFilters ] = useState([]);
  const [ filtersActive, setFiltersActive ] = useState(columnFilters.length > 0);
  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters: filtersActive ? columnFilters : inactiveFilters
    },
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: initialPageSize
      }
    },
    onColumnFiltersChange: filtersActive ? setColumnFilters : setInactiveFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    debugTable: false,
    debugHeaders: false,
    debugColumns: false,
  });
  
  const { pageIndex, pageSize } = table.getState().pagination;

  return (
    <div>
      <table className="w-full mb-2">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header, index) => {
                const { alignHeader } = header.column.columnDef.meta ?? {};
                let alignClass = 'text-left';

                if (alignHeader === 'center') {
                  alignClass = 'text-center';
                }

                const colSpan = withRowCount && index === 0
                  ? 2
                  : header.colSpan;

                return (
                  <th
                    key={header.id}
                    colSpan={colSpan}
                    className={[
                      'pb-2 transition duration-400',
                      'dark:bg-neutral-800 sticky top-0',
                      "after:content-[''] after:block after:h-0.5 after:w-full",
                      'after:absolute after:bottom-0 after:left-0',
                      columnFilters.length ? 'dark:after:bg-lime-500' : 'dark:after:bg-lime-100'
                    ].join(' ')}
                  >
                    {header.isPlaceholder ? null : (
                      <>
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? `text-base mt-1 mx-2 ${alignClass} cursor-pointer select-none`
                              : `text-base mt-1 mx-2 ${alignClass}`,
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: <span className="ml-1 text-white">⇡</span>,
                            desc: <span className="ml-1 text-white">⇣</span>,
                          }[header.column.getIsSorted()] ?? null}
                        </div>
                        {filtersActive && header.column.getCanFilter() ? (
                          <div className={`${alignClass} mt-0.5 mx-2`}>
                            <Filter column={header.column} />
                          </div>
                        ) : null}
                      </>
                    )}
                  </th>
                )
              })}
              <th
                className={[
                  'pb-2 transition duration-400 overflow-hidden w-6',
                  'dark:bg-neutral-600 sticky top-0',
                  "after:content-[''] after:block after:h-0.5 after:w-full",
                  'after:absolute after:bottom-0 after:left-0',
                  columnFilters.length ? 'dark:after:bg-lime-500' : 'dark:after:bg-lime-100'
                ].join(' ')}
              >
                <div className="flex flex-col grow justify-evenly max-h-full h-full">
                  <button
                    className={[
                      'py-2 w-full flex justify-center items-center cursor-pointer',
                      'transition dark:hover:bg-neutral-500/50',
                      filtersActive
                        ? 'dark:text-lime-400 dark:hover:text-lime-300'
                        : ''
                    ].join(' ')}
                    title="Toggle filters"
                    onClick={() => setFiltersActive(!filtersActive)}
                  >
                    <MagnifyingGlassIcon className="size-4" />
                  </button>
                  {resetFilters && (
                    <button
                      className={[
                        'py-2 w-full justify-center items-center cursor-pointer',
                        'transition dark:hover:bg-neutral-500/50',
                        'dark:hover:text-rose-600',
                        filtersActive ? 'flex' : 'hidden'
                      ].join(' ')}
                      title="Clear filters"
                      onClick={resetFilters}
                    >
                      <ArrowPathIcon className="size-4" />
                    </button>
                  )}
                </div>
              </th>
            </tr>
          ))}
        </thead>
        <tbody className="text-base/normal">
          {table.getRowModel().rows.map((row, index) => {
            const cells = row.getVisibleCells();

            return (
              <tr key={row.id} className="dark:even:bg-neutral-800/20 dark:hover:bg-neutral-600/25">
                {withRowCount && (
                  <td className="text-center dark:text-neutral-500 pl-0.5 text-sm">
                    {index + 1 + pageIndex * pageSize}
                  </td>
                )}
                {cells.map((cell, index) => {
                  return (
                    <td
                      key={cell.id}
                      colSpan={index + 1 === cells.length ? 2 : 1}
                      className="px-2 py-1"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
      {!!columnFilters.length && <p className="dark:text-neutral-400 text-center mb-1">
        {renderNumberOfRows(table.getPrePaginationRowModel().rows.length)}
      </p>}
      <div className="flex flex-row items-center justify-center gap-2 mb-3">
        <button
          className="border rounded p-1 disabled:opacity-50"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {'<<'}
        </button>
        <button
          className="border rounded p-1 disabled:opacity-50"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<'}
        </button>
        <button
          className="border rounded p-1 disabled:opacity-50"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>'}
        </button>
        <button
          className="border rounded p-1 disabled:opacity-50 mr-auto"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {'>>'}
        </button>
        <span className="flex items-center gap-1 mr-2">
          <div>Page</div>
          <strong>
            {pageIndex + 1} of{' '}
            {table.getPageCount()}
          </strong>
        </span>
        <span className="flex items-center gap-1">
          Go to page:
          <Input
            type="number"
            value={pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              table.setPageIndex(page)
            }}
            className="border p-1 rounded w-16"
          />
        </span>
        <Menu>
          <MenuButton
             className="flex items-center gap-1 ml-auto rounded-md dark:bg-neutral-900 pl-3 pr-2 py-1 text-sm/6 font-semibold dark:text-neutral-300 shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white dark:data-hover:bg-neutral-700 dark:data-open:bg-neutral-700"
          >
            Show {pageSize} <ChevronDownIcon className="size-4" />
          </MenuButton>
          <MenuItems
            transition
            anchor="bottom end"
            className="w-32 origin-top-right rounded-xl border dark:border-white/5 dark:bg-bg2-d p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0"
          >
            {[10, 25, 50, 100, 200].map(pageSize => (
              <MenuItem
                key={pageSize}
                onClick={() => {
                  table.setPageSize(pageSize)

                  if (onPerPageUpdate) {
                    onPerPageUpdate(pageSize)
                  }
                }}
              >
                <button className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10">
                  Show {pageSize}
                </button>
              </MenuItem>
            ))}
          </MenuItems>
        </Menu>
      </div>
    </div>
  );
}

export default Table;
