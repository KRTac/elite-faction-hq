import { useEffect, useState } from 'react';
import { format, formatDistanceToNow } from 'date-fns';


function DateTimeText({
  date, showDate = false, refreshSeconds = 30,
  dateFormat = "do MMM y 'at' HH:mm"
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

  if (showDate) {
    return format(date, dateFormat);
  }

  return formatDistanceToNow(date, { addSuffix: true });
}

export default DateTimeText;
