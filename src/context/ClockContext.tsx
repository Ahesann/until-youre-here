"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type ClockContextValue = {
  now: number;
  realNow: number;
  overrideNow: number | null;
  setOverrideNow: (timestamp: number | null) => void;
};

const ClockContext = createContext<ClockContextValue | null>(null);

export function ClockProvider({
  children,
  initialNow,
}: {
  children: ReactNode;
  initialNow: number;
}) {
  const [realNow, setRealNow] = useState(initialNow);
  const [overrideNow, setOverrideNowState] = useState<number | null>(null);

  useEffect(() => {
    if (overrideNow !== null) {
      return undefined;
    }

    let timeoutId: number | undefined;

    const schedule = () => {
      const current = Date.now();
      setRealNow(current);
      const delayToNextSecond = 1_000 - (current % 1_000);

      timeoutId = window.setTimeout(schedule, delayToNextSecond);
    };

    schedule();

    return () => {
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [overrideNow]);

  const setOverrideNow = useCallback((timestamp: number | null) => {
    if (timestamp !== null && Number.isFinite(timestamp)) {
      setOverrideNowState(timestamp);
      return;
    }

    setOverrideNowState(null);
    setRealNow(Date.now());
  }, []);

  const value = useMemo(
    () => ({
      now: overrideNow ?? realNow,
      realNow,
      overrideNow,
      setOverrideNow,
    }),
    [overrideNow, realNow, setOverrideNow],
  );

  return (
    <ClockContext.Provider value={value}>{children}</ClockContext.Provider>
  );
}

export function useClock(): ClockContextValue {
  const context = useContext(ClockContext);

  if (!context) {
    throw new Error("useClock must be used inside ClockProvider.");
  }

  return context;
}
