import { DependencyList, EffectCallback, useEffect, useRef } from 'react';

export function useUpdateEffect(
  effect: EffectCallback,
  deps: DependencyList = [],
) {
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    return effect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effect, ...deps]);
}
