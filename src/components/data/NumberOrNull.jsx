import numeral from 'numeral';
import ValueOrNull from './ValueOrNull';


export default function NumberOrNull({
  value, nullValue = -1, centerText = true,
  format = '0.00', prefix = null, suffix = null,
  ...rest
}) {
  return <ValueOrNull
    value={value}
    nullValue={nullValue}
    centerText={centerText}
    displayValue={(
      <>{prefix}{numeral(value).format(format)}{suffix}</>
    )}
    {...rest}
  />;
}
