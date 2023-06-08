import { differenceInWeeks, endOfYear, getWeek, startOfYear } from 'date-fns';

import { StravaClient } from '@/lib/strava';

const PER_WEEK = 20 * 1_000; // 20 km per week
const GOAL = 52 * PER_WEEK; // 52 weeks, 20 km per week

export default async function Dashboard() {
  const client = await StravaClient.create();
  const activities = await fetchAllActivities(client);

  const total_distance = activities.reduce((acc, activity) => {
    if (activity.sport_type !== 'Run') return acc;
    return acc + activity.distance;
  }, 0);

  const now = new Date();
  const current_week = getWeek(now);

  const expected_distance = current_week * PER_WEEK;

  const weeks_left = positive(differenceInWeeks(now, endOfYear(now)));
  const distance_per_week = (GOAL - total_distance) / weeks_left;

  const delta = total_distance - expected_distance;

  return (
    <main>
      <pre>
        {JSON.stringify(
          {
            goal: toKm(GOAL),
            expected_distance: toKm(expected_distance),
            total_distance: toKm(total_distance),
            delta: toKm(delta),
            required_distance_per_week: toKm(distance_per_week),
          },
          null,
          2,
        )}
      </pre>
    </main>
  );
}

async function fetchAllActivities(client: StravaClient) {
  const after = startOfYear(new Date()).getTime() / 1_000;
  const before = endOfYear(new Date()).getTime() / 1_000;
  const per_page = 50;

  let page = 1;
  let lastResponse = await client.activities({ after, before, page, per_page });

  const activities = lastResponse;

  while (lastResponse.length === per_page) {
    page += 1;
    lastResponse = await client.activities({ after, before, page, per_page });
    activities.push(...lastResponse);
  }

  return activities;
}

function toKm(meter: number) {
  return (meter / 1_000).toFixed(2) + ' km';
}

function positive(value: number) {
  return value > 0 ? value : value * -1;
}
