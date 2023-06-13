import { differenceInDays, differenceInWeeks, endOfYear, startOfYear, subDays } from 'date-fns';

import { StravaClient } from '@/lib/strava';
import { average, positive, toKm, toMinPerKm, total } from '@/lib/utils';

export async function Details({ date, goal }: { date: Date; goal: number }) {
  const client = await StravaClient.create();
  const runs = await client.activitiesForYear(date, 'Run');

  const total_distance = total(runs, (run) => run.distance);
  const average_distance = average(runs, (run) => run.distance);
  const average_pace = average(runs, (run) => run.average_speed);

  const current_day = differenceInDays(date, subDays(startOfYear(date), 1));
  const days_in_year = differenceInDays(endOfYear(date), subDays(startOfYear(date), 1));
  const year_progress = current_day / days_in_year;
  const weeks_left = positive(differenceInWeeks(date, endOfYear(date)));

  const expected_distance = goal * year_progress;
  const distance_per_week = (goal - total_distance) / weeks_left;
  const delta = total_distance - expected_distance;

  return (
    <div className="grid grid-cols-2 items-stretch gap-6">
      <Card title={toKm(positive(delta))} subtitle={delta > 0 ? 'ahead of goal' : 'behind goal'} bg="bg-emerald-100" />
      <Card title={toKm(distance_per_week) + '/w'} subtitle="to reach goal" bg="bg-amber-100" />
      <Card title={toMinPerKm(average_pace)} subtitle="avg. pace" bg="bg-rose-100" />
      <Card title={toKm(average_distance)} subtitle="avg. distance" bg="bg-teal-100" />
    </div>
  );
}

interface CardProps {
  title: React.ReactNode;
  subtitle: React.ReactNode;
  bg: `bg-${'teal' | 'rose' | 'purple' | 'emerald' | 'amber'}-${number}`;
}

function Card({ title, subtitle, bg }: CardProps) {
  return (
    <div className={['flex aspect-square flex-col items-center justify-center rounded-xl p-2', bg].join(' ')}>
      <p className="mt-auto text-xl font-medium text-stone-600">{title}</p>
      <p className="align-end mt-auto self-start text-sm text-stone-500">{subtitle}</p>
    </div>
  );
}
