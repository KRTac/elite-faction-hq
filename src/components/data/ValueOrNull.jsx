export default function ValueOrNull({
  value, nullValue = null, nullText = '-',
  centerText = false, displayValue, className = ''
}) {
  const additionalClasses = centerText
    ? ' inline-block w-full text-center'
    : '';

  if (value === nullValue) {
    return (
      <span className={`italic dark:text-neutral-500${additionalClasses}`}>
        {nullText}
      </span>
    );
  }
  
  return (
    <span className={className + additionalClasses}>
      {displayValue === undefined ? value : displayValue}
    </span>
  );
}
