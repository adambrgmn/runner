import { endOfYear, isValid, startOfYear } from 'date-fns';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import { getServerSession } from './auth';

export class StravaClient {
  static async create() {
    const session = await getServerSession();
    if (session == null) throw new Error('No session found');

    return new StravaClient(session.access_token);
  }

  #accessToken: string;
  #baseUrl = new URL('/api/v3/', 'https://www.strava.com');

  constructor(accessToken: string) {
    this.#accessToken = accessToken;
  }

  get #bearer() {
    return `Bearer ${this.#accessToken}`;
  }

  async #get(path: string, query: Record<string, string | number> = {}): Promise<unknown> {
    const url = new URL(path.replace(/^\//, './'), this.#baseUrl);

    for (const [key, value] of Object.entries(query)) {
      url.searchParams.set(key, `${value}`);
    }

    const response = await fetch(url, {
      headers: { Authorization: this.#bearer },
    });

    if (response.status === 401) {
      redirect('/api/auth/refresh');
    }

    if (!response.ok || response.status > 299 || response.status < 200) {
      throw new Error(`Request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async athlete() {
    const athlete = await this.#get('/athlete');
    return AthleteSchema.parse(athlete);
  }

  async activities(params: z.infer<typeof PaginationSchema> = {}) {
    const activities = await this.#get('/athlete/activities', params);
    return ActivitySchema.array().parse(activities);
  }

  async activitiesForYear(year: Date = new Date(), type: z.infer<typeof SportType>) {
    const after = startOfYear(year).getTime() / 1_000;
    const before = endOfYear(year).getTime() / 1_000;
    const per_page = 100;

    let page = 1;
    let lastResponse = await this.activities({ after, before, page, per_page });

    const activities = lastResponse;

    while (lastResponse.length === per_page) {
      page += 1;
      lastResponse = await this.activities({ after, before, page, per_page });
      activities.push(...lastResponse);
    }

    return activities.filter((activity) => activity.sport_type === type);
  }
}

export type Athlete = z.infer<typeof AthleteSchema>;
export const AthleteSchema = z.object({
  id: z.number(),
  username: z.string().nullable(),
  firstname: z.string(),
  lastname: z.string(),
  profile_medium: z.string().nullable(),
  profile: z.string().nullable(),
});

export const SportType = z.enum([
  'AlpineSki',
  'BackcountrySki',
  'Badminton',
  'Canoeing',
  'Crossfit',
  'EBikeRide',
  'Elliptical',
  'EMountainBikeRide',
  'Golf',
  'GravelRide',
  'Handcycle',
  'HighIntensityIntervalTraining',
  'Hike',
  'IceSkate',
  'InlineSkate',
  'Kayaking',
  'Kitesurf',
  'MountainBikeRide',
  'NordicSki',
  'Pickleball',
  'Pilates',
  'Racquetball',
  'Ride',
  'RockClimbing',
  'RollerSki',
  'Rowing',
  'Run',
  'Sail',
  'Skateboard',
  'Snowboard',
  'Snowshoe',
  'Soccer',
  'Squash',
  'StairStepper',
  'StandUpPaddling',
  'Surfing',
  'Swim',
  'TableTennis',
  'Tennis',
  'TrailRun',
  'Velomobile',
  'VirtualRide',
  'VirtualRow',
  'VirtualRun',
  'Walk',
  'WeightTraining',
  'Wheelchair',
  'Windsurf',
  'Workout',
  'Yoga',
]);

export type Activity = z.infer<typeof ActivitySchema>;
export const ActivitySchema = z.object({
  id: z.number(),
  start_date: z.string().transform((date) => {
    const d = new Date(date);
    if (isValid(d)) return d;
    throw new Error(`Invalid date: ${date}`);
  }),
  start_date_local: z.string().transform((date) => {
    const d = new Date(date);
    if (isValid(d)) return d;
    throw new Error(`Invalid date: ${date}`);
  }),
  athlete: AthleteSchema.pick({ id: true }),
  name: z.string(),
  distance: z.number(),
  moving_time: z.number(),
  elapsed_time: z.number(),
  total_elevation_gain: z.number(),
  sport_type: SportType.nullable(),
  average_speed: z.number(),
});

export const PaginationSchema = z.object({
  page: z.number().positive().min(1).optional(),
  per_page: z.number().positive().min(1).optional(),
  before: z.number().optional(),
  after: z.number().optional(),
});
