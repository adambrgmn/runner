import { getWeek } from 'date-fns';

export function groupByWeek<Activity extends { start_date_local: Date }>(activities: Activity[]) {
  const weeks: Record<number, Activity[]> = {};

  for (const activity of activities) {
    const week = getWeek(activity.start_date_local);
    weeks[week] ??= [];
    weeks[week].push(activity);
  }

  return weeks;
}

export function average<T, Fn extends (item: T) => number>(items: T[], fn: Fn) {
  const total = items.reduce((acc, item) => acc + fn(item), 0);
  return total / items.length;
}

export function toKm(meter: number) {
  let km = (meter / 1_000).toFixed(1);
  if (km.endsWith('.0')) km = km.slice(0, -2);
  return km + ' km';
}

export function toMinPerKm(meterPerSecond: number) {
  const secondsPerMeter = 1 / meterPerSecond;
  const secondsPerKm = secondsPerMeter * 1_000;
  const minutesPerKm = secondsPerKm / 60;
  const min = Math.floor(minutesPerKm);
  const sec = Math.floor((minutesPerKm - min) * 60);

  return `${min}:${sec.toString().padStart(2, '0')} min/km`;
}

export function positive(value: number) {
  return value > 0 ? value : value * -1;
}
