import { getWeek, getYear, isSameYear } from 'date-fns';

import { StatisticsTable } from '@/components/StatisticsTable';
import { StravaClient } from '@/lib/strava';
import { average, groupBy, median, total } from '@/lib/utils';

interface StatisticsProps {
  now: Date;
}

export async function Statistics({ now }: StatisticsProps) {
  const client = await StravaClient.create();
  const activities = await client.allActivities(now, new Date('2010-01-01'), 'Run');

  const data = Object.entries(groupBy(activities, (activity) => getYear(activity.start_date_local).toString()))
    .sort(([yearA], [yearB]) => Number(yearB) - Number(yearA))
    .map(([year, runs]) => {
      const total_distance = total(runs, (run) => run.distance);
      const total_duration = total(runs, (run) => run.moving_time);
      const average_speed = total_distance / total_duration;

      const per_week = Object.values(groupBy(runs, (run) => getWeek(new Date(run.start_date_local)).toString()));
      const average_distance_per_week = average(
        per_week,
        (runs) => total(runs, (run) => run.distance),
        () => (isSameYear(new Date(year), now) ? getWeek(now) : 52),
      );

      return {
        title: year,
        average_speed,
        average_distance: average(runs, (run) => run.distance),
        average_distance_per_week,
        median_speed: median(runs, (run) => run.average_speed),
        median_distance: median(runs, (run) => run.distance),
        total_distance,
        total_runs: runs.length,
      } as const;
    });

  return <StatisticsTable data={data} />;
}
