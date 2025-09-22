import { format, formatDistanceToNow } from 'date-fns';

import { generated_at } from '../../assets/factions_meta.json';


function Standard({ children }) {
  const generatedDate = new Date(generated_at);
  return (
    <>
      <div className="dark:bg-bg2-d">
        <div className="max-w-site m-auto px-5 flex justify-between items-center">
          <p
            className={[
              'dark:text-blue-300 text-xl/6 tracking-wider',
              'max-w-site m-auto px-5 py-5'
            ].join(' ')}
          >
            1Elite Faction HQ
          </p>
          <p className="flex flex-col items-end text-sm">
            <span>Updated {formatDistanceToNow(generated_at, { addSuffix: true })}</span>
            <span className="dark:text-neutral-400">{format(generatedDate, "do MMM y 'at' HH:mm")}</span>
          </p>
        </div>
      </div>
      {children}
    </>
  );
}

export default Standard;
