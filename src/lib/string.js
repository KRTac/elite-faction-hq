import { format, formatDistanceToNow } from 'date-fns';


export const defaultDateFormat = "do MMM y' at 'HH:mm";

export function dateTimeText(
  date,
  showDate = false,
  dateFormat = defaultDateFormat,
  addSuffix = true
) {
  try {
    if (showDate) {
      return format(date, dateFormat);
    }

    return formatDistanceToNow(date, { addSuffix });
  } catch (ex) {
    console.log(ex);

    return 'invalid time';
  }
}

export function trimSlashes(s) {
  return s.replace(/^\/+|\/+$/g, '');
}

export function joinTitle(parts = []) {
  return parts.join(import.meta.env.VITE_SITE_TITLE_DELIMITER);
}
