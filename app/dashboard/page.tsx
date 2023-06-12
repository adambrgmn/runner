import { differenceInDays, differenceInWeeks, endOfYear, startOfYear, subDays } from 'date-fns';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

import { ProgressBar } from '@/components/ProgressBar';
import { getGoal } from '@/lib/goal';
import { StravaClient } from '@/lib/strava';
import { average, positive, toKm, toMinPerKm, total } from '@/lib/utils';

import { Statistics } from './Statistics';

export default async function Dashboard() {
  const now = new Date();

  const goal = getGoal();
  if (goal == null) redirect('/dashboard/settings');

  const client = await StravaClient.create();
  const runs = await client.activitiesForYear(now, 'Run');

  const total_distance = total(runs, (run) => run.distance);
  const average_distance = total_distance / runs.length;
  const average_pace = average(runs, (run) => run.average_speed);

  const current_day = differenceInDays(now, subDays(startOfYear(now), 1));
  const days_in_year = differenceInDays(endOfYear(now), subDays(startOfYear(now), 1));
  const year_progress = current_day / days_in_year;
  const weeks_left = positive(differenceInWeeks(now, endOfYear(now)));

  const expected_distance = goal * year_progress;
  const distance_per_week = (goal - total_distance) / weeks_left;
  const delta = total_distance - expected_distance;
  const progress = total_distance / goal;
  const expected_progress = expected_distance / goal;

  const progress_size = 200;

  return (
    <main className="relative mx-auto flex max-w-sm flex-col gap-6 px-6 pb-12">
      <h1 className="absolute left-6 top-0 text-sm text-stone-500">This year</h1>
      <div
        className="relative mx-auto flex flex-col items-center justify-center"
        style={{ width: progress_size, height: progress_size }}
      >
        <div className="absolute left-0 top-0">
          <ProgressBar
            size={progress_size}
            className="text-stone-200"
            trackWidth={1}
            bars={[
              { progress: progress, className: 'text-teal-300', trackWidth: 5 },
              {
                progress: expected_progress,
                className: expected_progress > progress ? 'text-rose-100' : 'text-teal-200',
                trackWidth: expected_progress > progress ? 3 : 5,
              },
            ]}
          />
        </div>
        <span className="text-5xl" role="img">
          🏃‍♂️
        </span>
        <p className="flex flex-col items-center text-xl font-medium text-stone-700">{toKm(total_distance)}</p>
        <p className="text-xs text-stone-500">Goal: {toKm(goal)}</p>
      </div>

      <div className="grid grid-cols-2 items-stretch gap-6">
        <Card
          title={toKm(positive(delta))}
          subtitle={delta > 0 ? 'ahead of goal' : 'behind goal'}
          bg="bg-emerald-100"
        />
        <Card title={toKm(distance_per_week) + '/w'} subtitle="to reach goal" bg="bg-amber-100" />
        <Card title={toMinPerKm(average_pace)} subtitle="avg. pace" bg="bg-rose-100" />
        <Card title={toKm(average_distance)} subtitle="avg. distance" bg="bg-teal-100" />
      </div>

      <Suspense>
        <div className="mt-20">
          <Statistics now={now} />
        </div>
      </Suspense>
    </main>
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
