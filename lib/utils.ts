export function groupBy<T>(items: T[], key: (item: T) => string) {
  const groups: Record<string, T[]> = {};

  for (const item of items) {
    const group = key(item);
    groups[group] ??= [];
    groups[group].push(item);
  }

  return groups;
}

export function average<T, Fn extends (item: T) => number>(items: T[], fn: Fn, length?: (items: T[]) => number) {
  const total = items.reduce((acc, item) => acc + fn(item), 0);
  return total / (length ? length(items) : items.length);
}

export function median<T, Fn extends (item: T) => number>(items: T[], fn: Fn) {
  const sorted = items.slice().sort((a, b) => fn(a) - fn(b));
  const half = Math.floor(sorted.length / 2);

  if (sorted.length % 2) return fn(sorted[half]);
  return (fn(sorted[half - 1]) + fn(sorted[half])) / 2;
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

export function cx(...classes: (string | undefined | null | boolean)[]) {
  return classes.filter(Boolean).join(' ');
}
