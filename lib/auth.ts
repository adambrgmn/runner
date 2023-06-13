import NextAuth, { AuthOptions } from 'next-auth';
import { getServerSession as _getServerSession } from 'next-auth/next';
import StravaProvider from 'next-auth/providers/strava';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import { env } from '@/env.mjs';

const strava = StravaProvider({
  clientId: env.STRAVA_CLIENT_ID,
  clientSecret: env.STRAVA_CLIENT_SECRET,
});
if (strava.authorization != null && typeof strava.authorization !== 'string' && strava.authorization.params != null) {
  strava.authorization.params.scope = 'activity:read_all';
}

export const options: AuthOptions = {
  secret: env.NEXTAUTH_SECRET,
  providers: [strava],

  callbacks: {
    async jwt({ token, account }) {
      if (account && account.access_token != null && account.refresh_token != null && account.expires_at != null) {
        token.access_token = account.access_token;
        token.refresh_token = account.refresh_token;
        token.expires_at = account.expires_at;
        return token;
      }

      const now = Date.now() / 1_000;
      const isExpired = token.expires_at != null && token.expires_at < now;
      if (isExpired) {
        console.log({ isExpired, ...token });
        try {
          const url = new URL('https://www.strava.com/oauth/token');
          url.searchParams.append('client_id', env.STRAVA_CLIENT_ID);
          url.searchParams.append('client_secret', env.STRAVA_CLIENT_SECRET);
          url.searchParams.append('grant_type', 'refresh_token');
          url.searchParams.append('refresh_token', token.refresh_token);
          const response = await fetch(url.toString(), { method: 'POST' });
          const data = RefreshTokenSchema.parse(await response.json());

          Object.assign(token, data);
          console.log('New access token refreshed');
          return token;
        } catch (error) {
          console.error('Failed to refresh access token');
          console.error(error);
          return { ...token, error: 'RefreshAccessTokenError' as const };
        }
      }

      return token;
    },
    async session({ session, token }) {
      session.access_token = token.access_token;
      return session;
    },
  },
};

export const handler = NextAuth(options);

export function getServerSession() {
  return _getServerSession(options);
}

export async function requireSession(redirectTo = '/') {
  const session = await getServerSession();
  if (session == null) redirect(redirectTo);
  return session;
}

declare module 'next-auth' {
  interface Session {
    access_token: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    access_token: string;
    refresh_token: string;
    expires_at: number;
  }
}

const RefreshTokenSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  expires_at: z.number(),
});
