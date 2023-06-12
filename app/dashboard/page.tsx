import { differenceInDays, differenceInWeeks, endOfYear, getWeek, startOfYear, subDays, subYears } from 'date-fns';

import { ProgressBar } from '@/components/ProgressBar';
import { StravaClient } from '@/lib/strava';
import { average, positive, toKm, toMinPerKm } from '@/lib/utils';

const PER_WEEK = 20 * 1_000; // 20 km per week
const GOAL = 52 * PER_WEEK; // 52 weeks, 20 km per week

export default async function Dashboard() {
  const now = new Date();

  const client = await StravaClient.create();
  const runs = await client.activitiesForYear(now, 'Run');
  const previousYears = await Promise.all([
    client.activitiesForYear(subYears(now, 1), 'Run'),
    client.activitiesForYear(subYears(now, 2), 'Run'),
    client.activitiesForYear(subYears(now, 3), 'Run'),
    client.activitiesForYear(subYears(now, 4), 'Run'),
  ]);

  const total_distance = runs.reduce((acc, activity) => acc + activity.distance, 0);

  const average_distance = total_distance / runs.length;
  const average_pace = average(runs, (run) => run.average_speed);

  const current_day = differenceInDays(now, subDays(startOfYear(now), 1));

  const days_in_year = differenceInDays(endOfYear(now), subDays(startOfYear(now), 1));
  const year_progress = current_day / days_in_year;

  const expected_distance = GOAL * year_progress;

  const weeks_left = positive(differenceInWeeks(now, endOfYear(now)));
  const distance_per_week = (GOAL - total_distance) / weeks_left;

  const delta = total_distance - expected_distance;

  const progress = total_distance / GOAL;
  const expected_progress = expected_distance / GOAL;

  const progress_size = 200;

  return (
    <main className="relative mx-auto flex max-w-sm flex-col gap-6 px-6 pb-12">
      <h1 className="absolute left-6 top-0 text-sm text-stone-500">This year</h1>
      <div
        className="relative mx-auto flex flex-col items-center justify-center"
        style={{ width: progress_size, height: progress_size }}
      >
        <span className="text-5xl" role="img">
          🏃‍♂️
        </span>
        <p className="flex flex-col items-center text-xl font-medium text-stone-700">{toKm(total_distance)}</p>
        <p className="text-xs text-stone-500">Goal: {toKm(GOAL)}</p>

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
      </div>

      <div className="grid grid-cols-2 items-stretch gap-6">
        <Card title={toKm(positive(delta))} subtitle={delta > 0 ? 'ahead' : 'behind'} bg="bg-emerald-100" />
        <Card title={toKm(distance_per_week) + '/w'} subtitle="to reach goal" bg="bg-amber-100" />
        <Card title={toMinPerKm(average_pace)} subtitle="avg. pace" bg="bg-rose-100" />
        <Card title={toKm(average_distance)} subtitle="avg. distance" bg="bg-teal-100" />
      </div>

      <div>
        {[runs, ...previousYears].map((runs, i) => (
          <div key={i}>
            <p>{toMinPerKm(average(runs, (run) => run.average_speed))}</p>
            <p>{toKm(average(runs, (run) => run.distance))}</p>
            <p>{runs.length}</p>
            <hr />
          </div>
        ))}
      </div>
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
