import { Context, useContext } from 'react';
import { useStrictContext } from '@/hooks/useStrictContext';

export function createStrictContextHook<T = unknown>(
  context: Context<T>,
  contextName = context.displayName || 'Unknown Context',
) {
  return () => {
    return useStrictContext(context, contextName);
  };
}

export function createContextHook<T = unknown>(context: Context<T>) {
  return () => {
    return useContext(context);
  };
}
