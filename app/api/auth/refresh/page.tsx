'use client';

import { signIn } from 'next-auth/react';
import { useEffect } from 'react';

export default function AuthRefresh() {
  useEffect(() => {
    signIn('strava', { callbackUrl: '/dashboard' });
  }, []);

  return null;
}
