import { Link } from '@tanstack/react-router';
import { ChevronLeftIcon } from '@heroicons/react/20/solid';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import NavLink from './NavLink';
import DateTimeText from './data/DateTimeText';
import useFactionDataset from '../hooks/useFactionDataset';
import DatasetSelector from './DatasetSelector';


function HeaderButton({ to, children, matchExact }) {
  return (
    <NavLink
      className={[
        'text-lg transition-all duration-200 no-underline',
        'dark:text-stone-300 dark:data-active:text-lime-500',
        'dark:hover:text-lime-100 dark:data-active:hover:text-lime-300'
      ].join(' ')}
      to={to}
      matchExact={matchExact}
    >
      {children}
    </NavLink>
  );
}

function DatasetsPopup() {
  const { timestamp } = useFactionDataset();

  return (
    <Popover className="h-full">
      <PopoverButton
        className={[
          'block cursor-pointer h-full w-40 text-center',
          'focus:outline-none data-focus:outline transition duration-200',
          'dark:bg-slate-800 dark:hover:bg-slate-700'
        ].join(' ')}
      >
        <span className="block text-sm text-ellipsis whitespace-nowrap px-2 overflow-hidden"><DateTimeText date={timestamp} /></span>
        <span className="block text-xs pt-0.5 text-neutral-400 text-ellipsis whitespace-nowrap px-2 overflow-hidden"><DateTimeText date={timestamp} showDate /></span>
      </PopoverButton>
      <PopoverPanel
        transition
        anchor="top"
        className={[
          'w-full md:w-xl px-3',
          'transition duration-200 ease-in-out',
          'text-sm/6 [--anchor-gap:--spacing(0)]',
          'data-closed:-translate-y-1 data-closed:opacity-0'
        ].join(' ')}
      >
        <div className="dark:bg-slate-800 p-2 rounded-b-lg border-b-2 border-accent-d/50 flex flex-col items-center">
          <DatasetSelector />
        </div>
      </PopoverPanel>
    </Popover>
  );
}

function Header({ factionName }) {
  return (
    <div className="dark:bg-bg2-d px-3">
      <div className="max-w-site mx-auto flex flex-nowrap items-center">
        <Link
          className={[
            'flex flex-nowrap items-center text-xl transition duration-200',
            'group dark:text-slate-400 dark:hover:text-blue-400',
            'px-1 py-1 mr-3 my-3 border-[1px] rounded-md'
          ].join(' ')}
          to="/"
          search={{ dataset: undefined }}
        >
          <ChevronLeftIcon
            className="size-5 transition duration-200 dark:text-neutral-100 dark:group-hover:text-accent-d"
          />
        </Link>
        <p className="text-xl mx-3 font-semibold dark:text-slate-400">
          {factionName}
        </p>
        <div className="flex flex-nowrap gap-4 ml-10 mx-5">
          <HeaderButton to="/$factionDir/" matchExact>Systems</HeaderButton>
          <HeaderButton to="/$factionDir/details">Details</HeaderButton>
        </div>
        <div className="ml-auto self-stretch">
          <DatasetsPopup />
        </div>
      </div>
    </div>
  );
}

export default Header;
