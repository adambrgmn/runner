'use client';

import { useIsomorphicLayoutEffect } from 'framer-motion';
import { getSession } from 'next-auth/react';
import { useEffect, useRef } from 'react';

export function SessionCheck() {
  const isPendingRef = useRef(false);

  useInterval(() => {
    if (isPendingRef.current) return;

    isPendingRef.current = true;
    getSession().finally(() => {
      isPendingRef.current = false;
    });
  }, 30_000);
}

function useInterval(callback: () => void, delay: number | null): void {
  const savedCallback = useRef(callback);

  useIsomorphicLayoutEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    if (delay != null) {
      const tick = (): void => savedCallback.current();
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
