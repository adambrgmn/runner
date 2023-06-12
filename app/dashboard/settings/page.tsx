import { redirect } from 'next/navigation';

import { getGoal, setGoal } from '@/lib/goal';

async function updateGoal(data: FormData) {
  'use server';
  const next = data.get('goal');
  const goal = Number(next);

  if (Number.isNaN(goal)) {
    redirect('/dashboard/settings?reason=' + encodeURIComponent('Invalid goal value. Must be a number'));
  }

  setGoal(goal * 1_000);
  redirect('/dashboard');
}

interface GoalProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function Goal({ searchParams }: GoalProps) {
  const goal = getGoal();
  const reason = searchParams.reason != null && !Array.isArray(searchParams.reason) ? searchParams.reason : null;

  return (
    <main className="relative mx-auto mt-12 flex max-w-sm flex-col gap-6 px-6 pb-12">
      <form className="flex flex-col items-stretch justify-stretch gap-8" action={updateGoal}>
        <div>
          <label className="flex flex-col gap-0">
            <span className="text-sm text-stone-500">Your goal</span>
            <div className="flex items-center rounded border border-stone-400">
              <input
                id="goal"
                name="goal"
                type="string"
                inputMode="decimal"
                defaultValue={goal != null ? goal / 1_000 : 520}
                className="flex-1 rounded-none border-r border-stone-400 bg-transparent p-2 text-right leading-none text-stone-700"
                required
                aria-invalid={reason != null}
                aria-describedby={reason != null ? 'goal-error' : undefined}
              />
              <span className="h-full p-2 leading-none text-stone-400">km</span>
            </div>
          </label>
          {reason != null ? (
            <p id="goal-error" className="mt-1 text-xs text-red-400">
              {reason}
            </p>
          ) : null}
        </div>

        <button type="submit" className="self-end rounded border border-stone-400 p-2 px-4 leading-none text-stone-700">
          Save
        </button>
      </form>
    </main>
  );
}
