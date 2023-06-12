'use client';

import { signIn } from 'next-auth/react';

export function SignInButton() {
  return (
    <button
      type="button"
      onClick={() => signIn('strava')}
      className="rounded bg-orange-500 px-8 py-2 text-sm text-white"
    >
      Sign in with Strava
    </button>
  );
}
