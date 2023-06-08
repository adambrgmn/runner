import NextAuth, { AuthOptions } from 'next-auth';
import { getServerSession as _getServerSession } from 'next-auth/next';
import StravaProvider from 'next-auth/providers/strava';
import { redirect } from 'next/navigation';

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
      if (account == null) return token;

      if (account.access_token != null) {
        token.access_token = account.access_token;
        return token;
      }

      throw new Error('No access token received from auth provider');
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
}

declare module 'next-auth' {
  interface Session {
    access_token: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    access_token: string;
  }
}
