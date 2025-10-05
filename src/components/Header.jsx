import { Link, useSearch } from '@tanstack/react-router';
import { ChevronLeftIcon } from '@heroicons/react/20/solid';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/solid';
import NavLink from './NavLink';
import useFaction from '../hooks/useFaction';
import DateTimeText from './data/DateTimeText';
import CompareSelector from './CompareSelector';


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

function DatasetSelector() {
  const { datasets } = useFaction();
  let { dataset } = useSearch({
    from: '/$factionDir'
  });
  let activeIndex = 0;
  
  if (dataset) {
    activeIndex = datasets.indexOf(dataset);
  }

  dataset = datasets[activeIndex];

  if (activeIndex === -1) {
    return null;
  }

  const timestampParts = dataset.split('T');
  const timestamp = `${timestampParts[0]}T${timestampParts[1].replaceAll('-', ':')}`;

  let prevDataset = '';
  let nextDataset = '';

  if (activeIndex > 0) {
    prevDataset = datasets[activeIndex - 1];
  }

  if (activeIndex < datasets.length - 1) {
    nextDataset = datasets[activeIndex + 1];
  }

  return (
    <div className="ml-auto flex flex-nowrap gap-2 items-center relative">
      <Link
        className="p-2 dark:hover:text-lime-500 transition duration-200 relative z-10"
        search={{
          dataset: prevDataset
        }}
        disabled={!prevDataset}
      >
        <ArrowLeftIcon className="size-6" />
      </Link>
      <div className="text-center w-40">
        <p className="text-sm dark:text-neutral-300">
          <DateTimeText date={timestamp} />
        </p>
        <p className="text-xs dark:text-neutral-400">
          <DateTimeText date={timestamp} showDate />
        </p>
      </div>
      <Link
        className="p-2 dark:hover:text-lime-500 transition duration-200 relative z-10"
        search={{
          dataset: nextDataset
        }}
        disabled={!nextDataset}
      >
        <ArrowRightIcon className="size-6" />
      </Link>
    </div>
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
        <DatasetSelector />
        <CompareSelector />
      </div>
    </div>
  );
}

export default Header;
