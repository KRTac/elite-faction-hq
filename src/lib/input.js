export function filterRange(
  range,
  minProp = { minimum: 0 },
  maxProp = { minimum: 0 },
  defaultValue = ''
) {
  if (!Array.isArray(range) || range.length !== 2) {
    console.warn('Range not valid.', range);

    return [ defaultValue, defaultValue ];
  }

  let min = range[0] ? Number(range[0]) : NaN;
  let max = range[1] ? Number(range[1]) : NaN;

  if (isNaN(min) || min < minProp.minimum) {
    min = defaultValue;
  }

  if (
    isNaN(max) ||
    max < maxProp.minimum ||
    (min !== defaultValue && max < min)
  ) {
    max = defaultValue;
  }

  return [ min, max ];
}
