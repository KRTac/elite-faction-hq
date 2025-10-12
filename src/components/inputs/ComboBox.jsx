import { useState } from 'react';
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid';


function ComboBox({ options, value = '', onChange }) {
  const [ query, setQuery ] = useState('');

  const filtered =
    query === ''
      ? options
      : options.filter(o => {
          if (typeof o === 'string') {
            return o.toLowerCase().includes(query.toLowerCase())
          }

          return o.label.toLowerCase().includes(query.toLowerCase())
        });

  return (
    <Combobox
      value={value}
      multiple={Array.isArray(value)}
      onChange={onChange}
      onClose={() => setQuery('')}
    >
      <div className="relative">
        <ComboboxInput
          className={[
            'w-full rounded-lg border-none dark:bg-white/5 py-0.5 pr-3 pl-2 text-sm/6 dark:text-neutral-300',
            'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 dark:data-focus:outline-white/25'
          ].join(' ')}
          displayValue={val => {
            if (Array.isArray(val)) {
              return val.join(', ');
            }

            return val;
          }}
          onChange={(event) => setQuery(event.target.value)}
        />
        <ComboboxButton className="group absolute inset-y-0 right-0 px-1.5">
          <ChevronDownIcon className="size-4 dark:fill-white/60 dark:group-data-hover:fill-white" />
        </ComboboxButton>
      </div>
      <ComboboxOptions
        anchor="bottom"
        transition
        className={[
          'w-(--input-width) rounded-xl border dark:border-neutral-700 dark:bg-neutral-900 p-1 [--anchor-gap:--spacing(1)] empty:invisible',
          'transition duration-100 ease-in data-leave:data-closed:opacity-0'
        ].join(' ')}
      >
        {filtered.map(option => {
          let label = '';
          let value;

          if (typeof option === 'string') {
            value = option;
          } else {
            label = ` - ${option.label}`;
            value = option.value;
          }

          return (
            <ComboboxOption
              key={value}
              value={value}
              className="group flex cursor-default items-center gap-1 rounded-lg px-1 py-0.5 select-none dark:data-focus:bg-white/10"
            >
              <CheckIcon className="invisible size-4 dark:fill-white group-data-selected:visible" />
              <div className="text-sm/6 dark:text-neutral-300">{value}{label}</div>
            </ComboboxOption>
          );
        })}
      </ComboboxOptions>
    </Combobox>
  );
}

export default ComboBox;
