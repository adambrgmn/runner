import NextAuth, { AuthOptions } from 'next-auth';
import StravaProvider from 'next-auth/providers/strava';

import { env } from '@/env.mjs';

export const options: AuthOptions = {
  providers: [
    StravaProvider({
      clientId: env.STRAVA_CLIENT_ID,
      clientSecret: env.STRAVA_CLIENT_SECRET,
    }),
  ],
};

export const handler = NextAuth(options);
