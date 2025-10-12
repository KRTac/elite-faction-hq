import { useMemo } from 'react';
import { Link, createLazyFileRoute } from '@tanstack/react-router';
import StandardLayout from '../components/layouts/Standard';
import useDatasetsMeta from '../hooks/useDatasetsMeta';
import usePageTitle from '../hooks/usePageTitle';
import { powerTextClass } from '../lib/elite';


function Dashboard() {
  usePageTitle();
  const { factions, powers } = useDatasetsMeta();
  const sortedPowers = useMemo(() => powers.sort((a, b) => b.system_count - a.system_count), [ powers ]);

  return (
    <StandardLayout>
      <div
        className={[
          'max-w-3xl mx-auto mt-3 p-3',
          'flex justify-center gap-3'
        ].join(' ')}
      >
        <div>
          <h2 className="text-xl dark:text-slate-400 mx-4 mb-3">
            Factions
          </h2>
          <ol>
            {factions.map(faction => {
              return (
                <li
                  className="block mb-3"
                  key={faction.directory}
                >
                  <Link
                    className={[
                      'block text-lg px-4 py-2 no-underline group',
                      'rounded-lg dark:bg-neutral-900 dark:hover:bg-neutral-800 transition duration-200'
                    ].join(' ')}
                    to={`/${faction.directory}`}
                  >
                    {faction.name}
                    <span
                      className="inline-block ml-2 text-sm dark:text-neutral-400 dark:group-hover:text-neutral-200 transition duration-200"
                    >
                      {faction.system_count}
                    </span>
                  </Link>
                </li>
            )})}
          </ol>
        </div>
        <div>
          <h2 className="text-xl dark:text-slate-400 mx-4 mb-3">
            Powers
          </h2>
          <ol className="w-full">
            {sortedPowers.map(power => {
              return (
                <li
                  className="block mb-3"
                  key={power.directory}
                >
                  <Link
                    className={[
                      'block text-lg px-4 py-2 no-underline group transition duration-200',
                      'rounded-lg dark:bg-neutral-900 dark:hover:bg-neutral-800',
                      `dark:text-neutral-300 dark:hover:${powerTextClass(power.name)}`
                    ].join(' ')}
                    to={`/${power.directory}`}
                  >
                    {power.name}
                    <span
                      className="inline-block ml-2 text-sm dark:text-neutral-400 dark:group-hover:text-neutral-200 transition duration-200"
                    >
                      {power.system_count}
                    </span>
                  </Link>
                </li>
            )})}
          </ol>
        </div>
      </div>
    </StandardLayout>
  );
}

export const Route = createLazyFileRoute('/')({
  component: Dashboard
});
