import Input from './Input';


export function filterRange(
  range,
  minProp = { minimum: 0 },
  maxProp = { minimum: 0 },
  defaultValue = ''
) {
  if (!Array.isArray(range) || range.length !== 2) {
    console.warn('Range not valid.', range);

    return [ defaultValue, defaultValue ];
  }

  let min = range[0] ? Number(range[0]) : NaN;
  let max = range[1] ? Number(range[1]) : NaN;

  if (isNaN(min) || min < minProp.minimum) {
    min = defaultValue;
  }

  if (
    isNaN(max) ||
    max < maxProp.minimum ||
    (min !== defaultValue && max < min)
  ) {
    max = defaultValue;
  }

  return [ min, max ];
}

function Range({
  label, value, isActive, set, reset, min = 0,
  disabled
}) {
  return (
    <div
      className={[
        'min-w-3xs flex items-stretch dark:bg-zinc-800 rounded-md p-0.5',
        'border-0 border-l-8 dark:border-neutral-400',
        isActive ? 'dark:border-l-lime-500' : '',
        disabled ? 'opacity-40' : ''
      ].join(' ')}
    >
      <div
        className={[
          'min-w-28 w-2/5 mr-2 flex flex-row-reverse items-center',
          disabled ? '' : 'cursor-pointer'
        ].join(' ')}
        onClick={disabled ? undefined : reset}
        role="button"
        tabIndex="0"
        aria-label="Filter label area. Click to clear the filter."
        aria-disabled={!!disabled}
        title="Clear filter"
      >
        <p className="text-sm text-right font-semibold dark:text-neutral-300">
          {label}
        </p>
      </div>
      <div className="flex-1 flex items-center justify-center w-full gap-2">
        <Input
          type="number"
          placeholder="min"
          value={value[0]}
          disabled={!!disabled}
          onChange={ev => set([ ev.target.value, value[1] ])}
          min={min}
          className="max-w-20 dark:bg-white/5 py-0.5 px-2 rounded-lg text-neutral-300"
        />
        <span className="dark:text-neutral-400 text-lg">-</span>
        <Input
          type="number"
          placeholder="max"
          value={value[1]}
          disabled={!!disabled}
          onChange={ev => set([ value[0], ev.target.value ])}
          min={min}
          className="max-w-20 dark:bg-white/5 py-0.5 px-2 rounded-lg text-neutral-300"
        />
      </div>
    </div>
  );
}

export default Range;
