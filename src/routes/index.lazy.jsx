import { Link, createLazyFileRoute } from '@tanstack/react-router';
import StandardLayout from '../components/layouts/Standard';
import useDatasetsMeta from '../hooks/useDatasetsMeta';
import usePageTitle from '../hooks/usePageTitle';
import PowerName from '../components/data/PowerName';


function SubjectList({ subjects }) {
  return (
    <ol className="flex flex-wrap justify-center gap-3">
      {subjects.map(subject => {
        return (
          <li
            className={[
              'block flex-1 basis-1/2'
            ].join(' ')}
          >
            <Link
              className={[
                'block px-6 py-3 rounded-md dark:bg-bg2-d dark:hover:bg-bg2-d/80',
                'cursor-pointer transition duration-200',
                'border-2 border-transparent dark:hover:border-neutral-600',
                'text-lg dark:hover:text-accent-d no-underline'
              ].join(' ')}
              to={`/${subject.directory}`}
              key={subject.directory}
            >
              {subject.name}
            </Link>
          </li>
        );
      })}
    </ol>
  );
}

function Dashboard() {
  usePageTitle();
  const { factions, powers } = useDatasetsMeta();

  return (
    <StandardLayout>
      <div
        className={[
          'max-w-3xl mx-auto mt-3 p-3',
          'flex justify-center gap-3'
        ].join(' ')}
      >
        <ol className="grid sm:grid-cols-2 gap-3">
          {factions.map(power => {
            return (
              <li
                className="block"
                key={power.directory}
              >
                <Link
                  className={[
                    'block text-lg px-4 py-2 no-underline',
                    'rounded-lg dark:bg-neutral-900 dark:hover:bg-neutral-800 transition duration-200'
                  ].join(' ')}
                  to={`/${power.directory}`}
                >
                  {power.name}
                </Link>
              </li>
          )})}
        </ol>
        <ol className="w-full max-w-54">
          {powers.map(power => {
            return (
              <li
                className="block rounded-lg dark:bg-neutral-800 dark:hover:bg-neutral-700 transition duration-200"
                key={power.directory}
              >
                <Link
                  className="block text-lg px-4 py-2 no-underline mb-3"
                  to={`/${power.directory}`}
                >
                  <PowerName name={power.name} />
                </Link>
              </li>
          )})}
        </ol>
      </div>
    </StandardLayout>
  );
}

export const Route = createLazyFileRoute('/')({
  component: Dashboard
});
