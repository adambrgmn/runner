import { addYears } from 'date-fns';
import { cookies } from 'next/headers';

const GOAL_COOKIE_NAME = 'runner_goal';

export function getGoal() {
  const store = cookies();
  const cookie = store.get(GOAL_COOKIE_NAME)?.value;

  if (cookie == null) return null;

  const goal = Number(cookie);
  if (Number.isNaN(goal)) return null;

  return goal;
}

export function setGoal(goal: number) {
  cookies().set({
    name: GOAL_COOKIE_NAME,
    value: goal.toString(),
    secure: process.env.NODE_ENV === 'production',
    expires: addYears(new Date(), 1),
  });
}

export function hasGoal() {
  return cookies().has(GOAL_COOKIE_NAME);
}
