import { differenceInDays, endOfYear, startOfYear, subDays } from 'date-fns';
import { Fragment } from 'react';

import { ProgressBar } from '@/components/ProgressBar';
import { StravaClient } from '@/lib/strava';
import { toKm, total } from '@/lib/utils';

const PROGRESS_SIZE = 200;

type SummaryProps = {
  date: Date;
  goal: number;
};

export async function Summary({ date, goal }: SummaryProps) {
  const client = await StravaClient.create();
  const runs = await client.activitiesForYear(date, 'Run');

  const total_distance = total(runs, (run) => run.distance);

  const current_day = differenceInDays(date, subDays(startOfYear(date), 1));
  const days_in_year = differenceInDays(endOfYear(date), subDays(startOfYear(date), 1));
  const year_progress = current_day / days_in_year;

  const expected_distance = goal * year_progress;
  const progress = (total_distance / goal) * 1;
  const expected_progress = expected_distance / goal;

  return (
    <Fragment>
      <h1 className="absolute left-6 top-0 text-sm text-stone-500">This year</h1>
      <div
        className="relative mx-auto flex flex-col items-center justify-center"
        style={{ width: PROGRESS_SIZE, height: PROGRESS_SIZE }}
      >
        <div className="absolute left-0 top-0">
          <ProgressBar
            size={PROGRESS_SIZE}
            className="text-stone-200"
            trackWidth={1}
            bars={[
              { progress: progress, className: 'text-teal-300', trackWidth: 5 },
              {
                progress: expected_progress,
                className: expected_progress > progress ? 'text-rose-100' : 'text-teal-100',
                trackWidth: 2,
              },
            ]}
          />
        </div>
        <span className="text-5xl" role="img">
          🏃‍♂️
        </span>
        <p className="flex flex-col items-center text-xl font-medium text-stone-700">{toKm(total_distance)}</p>
        <p className="text-xs text-stone-500">Expected: {toKm(expected_distance)}</p>
        <p className="text-xs text-stone-500">Goal: {toKm(goal)}</p>
      </div>
    </Fragment>
  );
}
