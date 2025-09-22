import { createFileRoute, Link } from '@tanstack/react-router';
import StandardLayout from '../components/layouts/Standard';

import { factions } from '../assets/factions_meta.json';


function Dashboard() {
  return (
    <StandardLayout>
      <div
        className={[
          'max-w-3xl mx-auto mt-3 p-3 gap-3',
          'flex flex-wrap justify-center'
        ].join(' ')}
      >
        {factions.map(faction => {
          return (
            <Link
              className={[
                'block px-6 py-4 rounded-md dark:bg-bg2-d dark:hover:bg-bg2-d/80',
                'w-full max-w-1/2 cursor-pointer transition duration-200',
                'border-2 border-transparent dark:hover:border-neutral-600',
                'text-lg dark:hover:text-accent-d'
              ].join(' ')}
              to={`/${faction.directory}`}
              key={faction.directory}
            >
              {faction.name}
            </Link>
          );
        })}
      </div>
    </StandardLayout>
  );
}

export const Route = createFileRoute('/')({
  component: Dashboard
});
