import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    STRAVA_CLIENT_ID: z.string(),
    STRAVA_CLIENT_SECRET: z.string(),
  },
  client: {},
  runtimeEnv: {
    STRAVA_CLIENT_ID: process.env.STRAVA_CLIENT_ID,
    STRAVA_CLIENT_SECRET: process.env.STRAVA_CLIENT_SECRET,
  },
});
