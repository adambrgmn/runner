export function groupBy<T>(items: T[], key: (item: T) => string) {
  const groups: Record<string, T[]> = {};

  for (const item of items) {
    const group = key(item);
    groups[group] ??= [];
    groups[group].push(item);
  }

  return groups;
}

export function average<T, Fn extends (item: T) => number>(items: T[], fn: Fn) {
  const total = items.reduce((acc, item) => acc + fn(item), 0);
  return total / items.length;
}

export function total<T, Fn extends (item: T) => number>(items: T[], fn: Fn) {
  return items.reduce((acc, item) => acc + fn(item), 0);
}

export function toKm(meter: number, skipUnit = false) {
  let km = (meter / 1_000).toFixed(1);
  if (km.endsWith('.0')) km = km.slice(0, -2);
  return `${km}${skipUnit ? '' : ' km'}`;
}

export function toMinPerKm(meterPerSecond: number, skipUnit = false) {
  const secondsPerMeter = 1 / meterPerSecond;
  const secondsPerKm = secondsPerMeter * 1_000;
  const minutesPerKm = secondsPerKm / 60;
  const min = Math.floor(minutesPerKm);
  const sec = Math.floor((minutesPerKm - min) * 60);

  return `${min}:${sec.toString().padStart(2, '0')}${skipUnit ? '' : ' min/km'}`;
}

export function positive(value: number) {
  return value > 0 ? value : value * -1;
}
