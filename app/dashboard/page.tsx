import { redirect } from 'next/navigation';
import { Suspense } from 'react';

import { getGoal } from '@/lib/goal';

import { Details } from './Details';
import { Statistics } from './Statistics';
import { Summary } from './Summary';

export default async function Dashboard() {
  const now = new Date();

  const goal = getGoal();
  if (goal == null) redirect('/dashboard/settings');

  return (
    <main className="relative mx-auto flex max-w-sm flex-col gap-6 px-6 pb-12">
      <Summary date={now} goal={goal} />
      <Details date={now} goal={goal} />
      <Suspense>
        <Statistics now={now} />
      </Suspense>
    </main>
  );
}
