import { Link } from '@tanstack/react-router';
import useDatasetsMeta from '../../hooks/useDatasetsMeta';
import DateTimeText from '../data/DateTimeText';


function Standard({ children }) {
  const { generated_at } = useDatasetsMeta();

  return (
    <>
      <div className="dark:bg-bg2-d">
        <div className="max-w-site m-auto px-5 flex justify-between items-center">
          <Link
            to="/"
            className={[
              'dark:text-blue-300 dark:hover:text-blue-100',
              'text-xl/6 no-underline tracking-wider',
              'transition duration-200',
              'max-w-site m-auto px-4 py-4 my-1'
            ].join(' ')}
          >
            {import.meta.env.VITE_SITE_TITLE}
          </Link>
          <p className="flex flex-col items-end text-sm">
            <span>Updated <DateTimeText date={generated_at} /></span>
            <span className="dark:text-neutral-400"><DateTimeText date={generated_at} showDate /></span>
          </p>
        </div>
      </div>
      {children}
    </>
  );
}

export default Standard;
