import { InputProps } from '@ui-kitten/components';
import { useState } from 'react';

export function useManagedInput(
  passedValue?: string,
  passedOnChangeText?: (newText: string) => void,
): Required<Pick<InputProps, 'value' | 'onChangeText'>> {
  const isUncontrolled =
    typeof passedValue === 'undefined' &&
    typeof passedOnChangeText === 'undefined';

  const [uncontrolledValue, setUncontrolledValue] = useState('');
  const value =
    (isUncontrolled ? uncontrolledValue : passedValue) ?? uncontrolledValue;
  const onChangeText = (newText: string) => {
    if (isUncontrolled) setUncontrolledValue(newText);
    else return passedOnChangeText?.(newText);
  };

  return {
    value,
    onChangeText,
  };
}
