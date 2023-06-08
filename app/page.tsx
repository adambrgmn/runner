import Link from 'next/link';
import { redirect } from 'next/navigation';

import { getServerSession } from '@/lib/auth';

export default async function Home() {
  const session = await getServerSession();
  if (session != null) redirect('/dashboard');

  return (
    <main>
      <Link href="/api/auth/signin">Sign in</Link>
    </main>
  );
}
