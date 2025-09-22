import { useContext } from 'react';
import numeral from 'numeral';
import { FactionDatasetContext } from '../hooks/useFactionDataset';
import DateTimeText from './data/DateTimeText';


function DetailsItem({ label, children, ...rest }) {
  return (
    <dl className="flex gap-2" { ...rest }>
      <dt className="w-2/6 text-right text-neutral-300 font-bold">{label}</dt>
      <dd>{children}</dd>
    </dl>
  );
}

function DetailsWrapper({ children, ...rest }) {
  return (
    <div { ...rest }>
      {children}
    </div>
  );
}

function FactionDetails() {
  const {
    stats, originSystem, inaraFactionId, timestamp,
    importDuration
  } = useContext(FactionDatasetContext);

  return (
    <div
      className={[
        'grid gap-x-4 grid-cols-[repeat(auto-fit,minmax(250px,400px))] justify-center',
        'py-2 px-4 my-5 dark:bg-neutral-900'
      ].join(' ')}
    >
      <DetailsWrapper>
        <DetailsItem label="Origin system">{originSystem}</DetailsItem>
        <DetailsItem label="Total systems">{stats.proccessedSystems.length}</DetailsItem>
        <DetailsItem label="Total population">{numeral(stats.totalPopulation).format('0,0')}</DetailsItem>
      </DetailsWrapper>
      <DetailsWrapper>
        {inaraFactionId && <DetailsItem label="Links">
          {inaraFactionId && <a href={`https://inara.cz/elite/minorfaction/${inaraFactionId}/`} target="_blank">Inara</a>}
        </DetailsItem>}
        <DetailsItem label="Import duration">{numeral(importDuration).format('0.00')}s</DetailsItem>
        <DetailsItem label="Generated at">
          <p><DateTimeText date={timestamp} showDate /></p>
          <p><DateTimeText date={timestamp} /></p>
        </DetailsItem>
      </DetailsWrapper>
    </div>
  );
}

export default FactionDetails;
