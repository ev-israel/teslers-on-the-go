import { DependencyList } from 'react';
import {
  AnimatableValue,
  cancelAnimation,
  useSharedValue,
} from 'react-native-reanimated';
import { useUpdateEffect } from './useUpdateEffect';

export function useTransitionableValue<Value extends AnimatableValue>(
  value: Value | (() => Value),
  animation: (value: Value) => Value,
  deps?: DependencyList,
) {
  const getValue = (): Value => {
    if (value instanceof Function) return value();
    return value;
  };
  const sharedValue = useSharedValue(getValue());

  useUpdateEffect(() => {
    sharedValue.value = animation(getValue());

    return () => {
      cancelAnimation(sharedValue);
    };
  }, [value, animation, ...(deps || [])]);

  return sharedValue;
}
