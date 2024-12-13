import { Input } from '@ui-kitten/components';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
} from 'react-native';
import Animated, {
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { CodeCell } from './CodeCell';
import { useInterval } from 'usehooks-ts';
import { useManagedInput } from './hooks/useManagedInput';
import {
  CancellablePromise,
  createCancellablePromise,
} from '@/utils/create-cancellable-promise';

export interface CodeInput {
  shake(): void;

  beginSuccessAnimation(): CancellablePromise<void>;
}

interface CodeInputProps {
  length: number;
  value?: string;
  error?: boolean;
  success?: boolean;

  onChange?(newValue: string): void;
}

export const CodeInput = forwardRef<CodeInput, CodeInputProps>((props, ref) => {
  const inputValueHandlingProps = useManagedInput(props.value, props.onChange);
  const inputRef = useRef<Input>(null);
  const shakingX = useSharedValue(0);
  const [animatingSuccess, setAnimatingSuccess] = useState(false);
  const [successAnimatingCell, setSuccessAnimatingCell] = useState(0);
  const successAnimationCompletedResolve = useRef<() => void>();

  useInterval(
    () => {
      setSuccessAnimatingCell((prev) => prev + 1);
    },
    animatingSuccess ? 500 : null,
  );

  useEffect(() => {
    if (animatingSuccess && successAnimatingCell + 1 > props.length) {
      setAnimatingSuccess(false);
      successAnimationCompletedResolve.current?.();
    }
    if (!animatingSuccess) {
      setSuccessAnimatingCell(0);
    }
  }, [animatingSuccess, successAnimatingCell, props.length]);

  useImperativeHandle(
    ref,
    () => ({
      shake() {
        shakingX.value = withSequence(
          withTiming(10, { duration: 100 }),
          withTiming(-10, { duration: 100 }),
          withTiming(10, { duration: 100 }),
          withTiming(0, { duration: 100 }),
        );
      },
      beginSuccessAnimation() {
        setAnimatingSuccess(true);
        setSuccessAnimatingCell(0);
        return createCancellablePromise(
          (resolve) => {
            successAnimationCompletedResolve.current = () => resolve(undefined);
          },
          () => {
            setAnimatingSuccess(false);
            setSuccessAnimatingCell(0);
            successAnimationCompletedResolve.current = undefined;
          },
        );
      },
    }),
    [],
  );

  const focusInput = () => {
    if (!Keyboard.isVisible()) inputRef.current?.blur();
    inputRef.current?.focus();
  };

  const codeDigitsArray = new Array(props.length).fill(0);

  return (
    <KeyboardAvoidingView>
      <Animated.View
        style={[
          styles.container,
          {
            transform: [
              {
                translateX: shakingX,
              },
            ],
          },
        ]}
      >
        <Pressable style={styles.cellsContainer} onPress={focusInput}>
          {codeDigitsArray.map((_val, index) => (
            <CodeCell
              key={index}
              char={inputValueHandlingProps.value[index]}
              error={props.error}
              success={
                animatingSuccess ? successAnimatingCell >= index : props.success
              }
            />
          ))}
        </Pressable>

        <Input
          ref={inputRef}
          keyboardType="number-pad"
          returnKeyType="done"
          autoComplete="one-time-code"
          maxLength={props.length}
          style={styles.hiddenInput}
          {...inputValueHandlingProps}
        />
      </Animated.View>
    </KeyboardAvoidingView>
  );
});
CodeInput.displayName = 'CodeInput';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 42,
  },
  hiddenInput: {
    position: 'absolute',
    left: '-100%',
    top: '-100%',
  },
  cellsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
