import { useEffect, useState } from 'react';
import { dateTimeText, defaultDateFormat } from '../../lib/string';


function DateTimeText({
  date, showDate = false, dateFormat = defaultDateFormat,
  timeAgoSuffix = true, refreshSeconds = 30
 }) {
  const [ _refresh, refresh ] = useState();

  useEffect(() => {
    if (refreshSeconds === 0 || showDate) {
      return;
    }

    const timeout = setTimeout(() => {
      refresh(!_refresh)
    }, refreshSeconds * 1000);

    return () => {
      refresh(!_refresh)
      clearTimeout(timeout);
    };
  }, [ _refresh, refreshSeconds, showDate ]);

  return dateTimeText(date, showDate, dateFormat, timeAgoSuffix);
}

export default DateTimeText;
