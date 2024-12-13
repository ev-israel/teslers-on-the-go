import { useEffect, useMemo, useState } from 'react';

interface AppendablePatternComponent extends BasePatternComponent {
  component: string | number;
  allowToAppend?: boolean;
}

interface UnappendablePatternComponent extends BasePatternComponent {
  component: RegExp | ((character: string) => boolean);
  allowToAppend?: false;
}

interface BasePatternComponent {
  unmask?: boolean;
}

type PatternComponent =
  | AppendablePatternComponent
  | UnappendablePatternComponent;
type Pattern = PatternComponent[];

function isNumericCharacter(char: string): boolean {
  const code = char.charCodeAt(0);
  return code >= 48 && code <= 57;
}

function createPattern(stringifiedPattern: string): Pattern {
  let shouldEscape = false;
  const pattern: Pattern = [];

  const pushCharacterComponent = (char: string, allowToAppend = true) =>
    pattern.push({ component: char, allowToAppend, unmask: false });

  for (let i = 0; i < stringifiedPattern.length; i++) {
    const character = stringifiedPattern[i];

    if (shouldEscape) {
      pushCharacterComponent(character, !isNumericCharacter(character));
      shouldEscape = !shouldEscape;
      continue;
    }

    if (character === '\\') {
      shouldEscape = !shouldEscape;
      continue;
    }

    switch (character) {
      case '0':
        pattern.push({
          component: isNumericCharacter,
          allowToAppend: false,
          unmask: true,
        });
        break;
      default:
        pattern.push({
          component: character,
          allowToAppend: !isNumericCharacter(character),
          unmask: isNumericCharacter(character),
        });
    }
  }

  return pattern;
}

function isCharMatchesPatternComponent(
  char: string,
  { component }: PatternComponent,
): boolean {
  if (typeof component === 'string') return char === component;
  if (typeof component === 'number') return char === component.toString();
  if (typeof component === 'function') return component(char);
  return component.test(char);
}

function maskValue(value: string, compiledPattern: Pattern) {
  let patternIndex = 0;
  let maskedValue = '';

  const maskedToUnmaskedIndicesMap = new Map<number, number>();
  const unmaskedToMaskedIndicesMap = new Map<number, number>();

  const hasPatternComponent = () => patternIndex < compiledPattern.length;
  const getPatternComponent = () => compiledPattern[patternIndex];

  for (let i = 0; i < value.length; ) {
    if (!hasPatternComponent()) break;
    const patternComponent = getPatternComponent();
    const valueChar = value[i];

    if (isCharMatchesPatternComponent(valueChar, patternComponent)) {
      maskedValue += valueChar;
      maskedToUnmaskedIndicesMap.set(maskedValue.length - 1, i);
      unmaskedToMaskedIndicesMap.set(i, maskedValue.length);
      i++;
      patternIndex++;
    } else if (patternComponent.allowToAppend) {
      maskedValue += patternComponent.component;
      patternIndex++;
    } else {
      break;
    }
  }

  return {
    value: maskedValue,
    maskedToUnmaskedIndicesMap,
    unmaskedToMaskedIndicesMap,
  };
}

export function unmaskValue(value: string, compiledPattern: Pattern): string {
  let valueIndex = 0;
  let unmaskedValue = '';
  let cleanUnmaskedValue = '';

  for (let i = 0; i < compiledPattern.length; i++, valueIndex++) {
    const patternComponent = compiledPattern[i];
    if (patternComponent.allowToAppend) {
      if (!patternComponent.unmask) {
        if (
          valueIndex < value.length &&
          !isCharMatchesPatternComponent(value[valueIndex], patternComponent)
        ) {
          valueIndex--;
        }
        continue;
      }
      unmaskedValue += patternComponent.component;
      continue;
    }

    const valueChar = value[valueIndex];
    if (!valueChar) break;
    unmaskedValue += valueChar;
    cleanUnmaskedValue = unmaskedValue;
  }

  return cleanUnmaskedValue;
}

export function useMaskedInput(
  pattern: string,
  derivedProps?: {
    value?: string;
    onChangeText?: (newText: string) => void;
  },
) {
  const compiledPattern = useMemo(() => createPattern(pattern), [pattern]);
  const [unmaskedValue, setUnmaskedValue] = useState('');
  const maskedValue = useMemo(
    () => maskValue(unmaskedValue, compiledPattern),
    [unmaskedValue, compiledPattern],
  );

  const onChangeText = (newText: string) => {
    const unmaskedValue = unmaskValue(newText, compiledPattern);
    setUnmaskedValue(unmaskedValue);
    derivedProps?.onChangeText?.(unmaskedValue);
  };

  useEffect(() => {
    if (derivedProps?.value && derivedProps?.value !== unmaskedValue) {
      setUnmaskedValue(derivedProps?.value);
    }
  }, [derivedProps, unmaskedValue]);

  return {
    value: maskedValue.value,
    onChangeText,
  };
}

export default {
  createPattern,
  maskValue,
  unmaskValue,
};
