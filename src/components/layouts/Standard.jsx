import { generated_at } from '../../assets/factions_meta.json';
import DateTimeText from '../data/DateTimeText';


function Standard({ children }) {
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
            Elite Faction HQ
          </p>
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
