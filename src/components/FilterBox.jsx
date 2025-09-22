import { useMemo } from 'react';
import ComboBox from './inputs/ComboBox';
import { useSystemFilter } from '../hooks/useSystemFilters';


function FilterBox({ label, filter }) {
  const { value, options, isActive, set, reset } = useSystemFilter(filter);

  const humanizedOptions = useMemo(() => {
    const humanized = [];

    for (const option of options) {
      if (typeof option === 'boolean') {
        humanized.push(option ? 'Yes' : 'No');

        continue;
      }

      humanized.push(option);
    }

    return humanized;
  }, [ options ]);

  return (
    <div
      className={[
        'min-w-3xs flex items-stretch dark:bg-zinc-800 rounded-md p-0.5',
        'border-0 border-l-8 dark:border-neutral-400',
        isActive ? 'dark:border-l-lime-500' : ''
      ].join(' ')}
    >
      <div
        className="min-w-28 w-2/5 mr-2 flex flex-row-reverse items-center cursor-pointer"
        onClick={reset}
        role="button"
        tabIndex="0"
        aria-label="Filter label area. Click to clear the filter."
        title="Clear filter"
      >
        <p className="text-sm text-right font-semibold dark:text-neutral-300">
          {label}
        </p>
      </div>
      <div className="flex-1 flex items-center">
        <div className="w-full">
          <ComboBox
            options={humanizedOptions}
            value={value}
            onChange={set}
          />
        </div>
      </div>
    </div>
  );
}

export default FilterBox;
