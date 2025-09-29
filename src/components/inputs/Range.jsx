import Input from './Input';


function Range({ label, value, min, max, isActive, set, reset }) {
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
      <div className="flex-1 flex items-center justify-center w-full gap-2">
        <Input
          type="number"
          placeholder="min"
          value={value[0]}
          onChange={val => set([ val, value[1] ])}
          className="max-w-20 dark:bg-white/5 py-0.5 px-2 rounded-lg text-neutral-300"
        />
        <span className="dark:text-neutral-400 text-lg">-</span>
        <Input
          type="number"
          placeholder="max"
          value={value[1]}
          onChange={val => set([ value[0], val ])}
          className="max-w-20 dark:bg-white/5 py-0.5 px-2 rounded-lg text-neutral-300"
        />
      </div>
    </div>
  );
}

export default Range;
