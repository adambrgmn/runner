import { redirect } from 'next/navigation';

import { SignInButton } from '@/components/SignInButton';
import { getServerSession } from '@/lib/auth';

export default async function Home() {
  const session = await getServerSession();
  if (session != null) redirect('/dashboard');

  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center p-6">
      <h1 className="text-lg font-bold text-stone-700">🏃‍♂️ Runner</h1>
      <p className="mb-4 text-sm text-stone-400">Keep track of your progress</p>
      <SignInButton />
    </main>
  );
}
