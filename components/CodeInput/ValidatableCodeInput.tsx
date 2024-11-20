import { useRef, useState } from 'react';
import { CodeInput } from './CodeInput';
import { validateWithLuhn } from '@/utils/luhn-algorithm';

const VALIDATION_ALGORITHMS = {
  luhn: (code: string) => validateWithLuhn(code),
} as const;

interface ValidatableCodeInputProps {
  length: number;
  instantValidationAlgorithm?: keyof typeof VALIDATION_ALGORITHMS;
  shakeOnError?: boolean;
  clearOnError?: boolean;
  clearStatusOnInput?: boolean;

  validateCode(enteredCode: string): Promise<boolean>;

  onSuccess?(): void;
}

export function ValidatableCodeInput({
  length,
  instantValidationAlgorithm,
  shakeOnError = true,
  clearOnError = true,
  clearStatusOnInput = true,
  validateCode,
  onSuccess,
}: ValidatableCodeInputProps) {
  const inputRef = useRef<CodeInput>(null);
  const [isErrored, setIsErrored] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [value, setValue] = useState('');

  const triggerError = () => {
    if (clearOnError) setValue('');
    if (shakeOnError) inputRef.current?.shake();
    setIsSuccess(false);
    setIsErrored(true);
  };

  const triggerSuccess = () => {
    setIsErrored(false);
    setIsSuccess(true);
    onSuccess?.();
  };

  const handleValueChange = async (newValue: string) => {
    setValue(newValue);

    if (clearStatusOnInput) {
      setIsErrored(false);
      setIsSuccess(false);
    }

    if (newValue.length !== length) return;

    if (instantValidationAlgorithm) {
      const implementation = VALIDATION_ALGORITHMS[instantValidationAlgorithm];
      if (!implementation(newValue)) return triggerError();
    }

    // we surpassed the instant validation algo, so we can proceed to the real validation
    // let's begin the animation and validation for the code
    if (!inputRef.current) return;

    const [successAnimationPromise, cancelSuccessAnimation] =
      inputRef.current.beginSuccessAnimation();
    const codeValidationPromise = (async () => {
      const result = await validateCode(newValue);

      if (!result) throw new Error('WrongCode');

      return true;
    })();

    // extract the result from the rejected/resolved promise
    const codeValidationResult = await new Promise(async (resolve) => {
      try {
        // await for both to resolve, but throw on first error
        const [codeValidationResult] = await Promise.all([
          codeValidationPromise,
          successAnimationPromise,
        ]);
        resolve(codeValidationResult);
      } catch (error) {
        if (error instanceof Error && error.message === 'WrongCode')
          return resolve(false);

        throw error;
      }
    });

    if (!codeValidationResult) {
      cancelSuccessAnimation('Validation Failed');
      return triggerError();
    }
    triggerSuccess();
  };

  return (
    <CodeInput
      ref={inputRef}
      length={length}
      value={value}
      onChange={handleValueChange}
      error={isErrored}
      success={isSuccess}
    />
  );
}
