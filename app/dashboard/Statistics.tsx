import { getYear } from 'date-fns';

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
    .sort(([keyA], [keyB]) => Number(keyB) - Number(keyA))
    .map(
      ([year, runs]) =>
        ({
          title: year,
          average_speed: average(runs, (run) => run.average_speed),
          average_distance: average(runs, (run) => run.distance),
          median_speed: median(runs, (run) => run.average_speed),
          median_distance: median(runs, (run) => run.distance),
          total_distance: total(runs, (run) => run.distance),
          total_runs: runs.length,
        } as const),
    );

  await sleep(10_000);

  return <StatisticsTable data={data} />;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
