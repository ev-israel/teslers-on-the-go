import { useMemo, useState } from 'react';
import { useInterval } from 'usehooks-ts';

export const RESOLUTION_MS = 1;
export const RESOLUTION_SEC = 1000;

export function useLeftTime(
  target: Date | null | undefined,
  resolution = RESOLUTION_MS,
): [leftTime: number | null, isReached: boolean] {
  const targetTime = useMemo(
    () => (!target ? null : target.getTime()),
    [target],
  );
  const [leftTime, setLeftTime] = useState<number | null>(
    targetTime ? targetTime - Date.now() : null,
  );
  const hasReachedTarget = !!targetTime && Date.now() >= targetTime;

  useInterval(
    () => {
      if (!targetTime) return setLeftTime(null);

      const now = Date.now();
      const left = targetTime - now;
      setLeftTime(left);
    },
    targetTime && !hasReachedTarget ? resolution : null,
  );

  return [leftTime, hasReachedTarget];
}
