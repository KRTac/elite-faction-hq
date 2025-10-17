import 'cally';
import { format, differenceInDays } from 'date-fns';
import { useEffect, useRef } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import useFaction from '../hooks/useFaction';
import useFactionDataset from '../hooks/useFactionDataset';
import { datasetsForDate, nameToDate } from '../lib/factionDataset';
import useDatasetComparison from '../hooks/useDatasetComparison';
import { dateTimeText } from '../lib/string';
import Button from './inputs/Button';


function DatasetsList({ datasets }) {
  return (
    <ul className="flex flex-row-reverse flex-wrap justify-center gap-2 mt-1 mx-1">
      {datasets.map(dataset => {
        return (
          <li key={dataset}>
            <Button
              as={Link}
              search={s => ({ ...s, dataset })}
              smaller
            >
              {dateTimeText(nameToDate(dataset), true, 'HH:mm')}
            </Button>
          </li>
        );
      })}
    </ul>
  );
}

function DatasetSelector() {
  const callyRef = useRef();
  const navigate = useNavigate();
  const { datasets } = useFaction();
  const { timestamp } = useFactionDataset();
  const { dataset: { timestamp: compareTimestamp }} = useDatasetComparison();

  const min = datasets[datasets.length - 1].split('T')[0];
  const max = datasets[0].split('T')[0];
  const selected = timestamp.split('T')[0];
  const compareDate = compareTimestamp.split('T')[0];

  useEffect(() => {
    let startDate = null;
    const onRangeStart = ev => {
      startDate = ev.detail;
    };
    const onRangeEnd = ev => {
      const endDate = ev.detail;
      let dataset;
      let compare;

      if (startDate < endDate) {
        dataset = datasetsForDate(endDate, datasets)[0];
        compare = datasetsForDate(startDate, datasets)[0];
      } else {
        dataset = datasetsForDate(startDate, datasets)[0];
        compare = datasetsForDate(endDate, datasets)[0];
      }

      localStorage.setItem('compareDataset_daysOld', differenceInDays(startDate, endDate));

      navigate({ search: { dataset, compare }});
    };

    const cally = callyRef.current;
    cally.addEventListener('rangestart', onRangeStart);
    cally.addEventListener('rangeend', onRangeEnd);

    return () => {
      cally.removeEventListener('rangestart', onRangeStart);
      cally.removeEventListener('rangeend', onRangeEnd);
    };
  }, [ datasets, navigate ]);

  const timestampDate = new Date(timestamp.split('T')[0]);
  const compareTimestampDate = new Date(compareTimestamp.split('T')[0]);
  const dateDatasets = datasetsForDate(timestampDate, datasets);
  const compareDatasets = datasetsForDate(compareTimestampDate, datasets);

  return (
    <>
      <div className="grid md:grid-cols-2 justify-stretch items-start gap-6 w-full mb-4">
        <div className="w-full">
          <h2 className="text-center">
            <span className="block text-xs text-neutral-400">Snapshot{dateDatasets.length > 1 && 's'} from</span>
            <span>{format(timestampDate, 'do MMM')}</span>
          </h2>
          {dateDatasets.length > 1 && <DatasetsList datasets={dateDatasets} />}
        </div>
        <div className="w-full">
          <h2 className="text-center">
            <span className="block text-xs text-neutral-400">Compare snapshot{compareDatasets.length > 1 && 's'} from</span>
            <span>{format(compareTimestampDate, 'do MMM')}</span>
          </h2>
          {compareDatasets.length > 1 && <DatasetsList datasets={compareDatasets} />}
        </div>
      </div>
      <div>
        <calendar-range
          ref={callyRef}
          value={`${compareDate}/${selected}`}
          min={min}
          max={max}
          months={1}
          pageBy="single"
          showOutsideDays={true}
          isDateDisallowed={date => datasetsForDate(date, datasets).length == 0}
          locale="en-GB"
        >
          <div className="flex flex-wrap justify-center items-start gap-6">
            <calendar-month></calendar-month>
            <calendar-month offset={1}></calendar-month>
          </div>
        </calendar-range>
      </div>
    </>
  );
}

export default DatasetSelector;
