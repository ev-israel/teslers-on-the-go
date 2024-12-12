import { Context, useContext } from 'react';

export function useStrictContext<T = unknown>(
  context: Context<T>,
  contextName = context.displayName || 'Unknown Context',
): NonNullable<T> {
  const value = useContext(context);
  if (value === undefined || value === null) {
    throw new Error(
      `${contextName} is null or undefined. Ensure the component using useStrictContext(${contextName}) is wrapped in its corresponding Provider.`,
    );
  }

  return value;
}
