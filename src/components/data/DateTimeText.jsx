import { useEffect, useState } from 'react';
import { format, formatDistanceToNow } from 'date-fns';


export const defaultDateFormat = "do MMM y' at 'HH:mm";

export function dateTimeText(
  date,
  showDate = false,
  dateFormat = defaultDateFormat,
  addSuffix = true
) {
  if (showDate) {
    return format(date, dateFormat);
  }

  return formatDistanceToNow(date, { addSuffix });
}

function DateTimeText({
  date, showDate = false, dateFormat = defaultDateFormat,
  timeAgoSuffix = true, refreshSeconds = 30
 }) {
  const [ _refresh, refresh ] = useState();

  useEffect(() => {
    if (refreshSeconds > 0 && !showDate) {
      const timeout = setTimeout(() => {
        refresh(!_refresh)
      }, refreshSeconds * 1000);

      return () => {
        refresh(!_refresh)
        clearTimeout(timeout);
      };
    }
  }, [ _refresh, refreshSeconds, showDate ]);

  return dateTimeText(date, showDate, dateFormat, timeAgoSuffix);
}

export default DateTimeText;
