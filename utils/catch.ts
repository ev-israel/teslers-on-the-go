type Constructor<T> = new (...args: any[]) => T;

type CatchValue<T, E> = [error: E, result: null] | [error: null, result: T];

type PromiseInput<T> = Promise<T>;
type CallbackInput<T> = () => T;
type WrappedValueForInput<
  Input extends PromiseInput<any> | CallbackInput<any>,
  T,
> = Input extends PromiseInput<any> ? Promise<T> : T;

type CatchValueForInput<
  Input extends PromiseInput<any> | CallbackInput<any>,
  E extends Error,
> =
  Input extends PromiseInput<infer U>
    ? Promise<CatchValue<U, E>>
    : Input extends CallbackInput<infer U>
      ? CatchValue<U, E>
      : never;

async function catchAsyncError<T, E extends Error = Error>(
  promise: Promise<T>,
  errorsToCatch?: Constructor<E>[],
): Promise<CatchValue<T, E>> {
  try {
    const result = await promise;
    return [null, result];
  } catch (error) {
    if (
      errorsToCatch &&
      errorsToCatch.length > 0 &&
      !errorsToCatch.some((e) => error instanceof e)
    ) {
      // That's an error we should not handle in any way
      throw error;
    }

    return [error as E, null];
  }
}

function catchCallbackError<T, E extends Error = Error>(
  cb: () => T,
  errorsToCatch?: Constructor<E>[],
): CatchValue<T, E> {
  try {
    const result = cb();
    return [null, result];
  } catch (error) {
    if (
      errorsToCatch &&
      errorsToCatch.length > 0 &&
      !errorsToCatch.some((e) => error instanceof e)
    ) {
      // That's an error we should not handle in any way
      throw error;
    }

    return [error as E, null];
  }
}

export function catchError<
  Input extends PromiseInput<any> | CallbackInput<any>,
  E extends Error = Error,
>(
  input: Input,
  errorsToCatch?: Constructor<E>[],
): CatchValueForInput<Input, E> {
  if (input instanceof Promise) {
    return catchAsyncError(input, errorsToCatch) as any;
  }

  return catchCallbackError(input, errorsToCatch) as any;
}

export function isSuccessful<
  Input extends PromiseInput<any> | CallbackInput<any>,
>(input: Input): WrappedValueForInput<Input, boolean> {
  if (input instanceof Promise) {
    return input.then(() => true).catch(() => false) as any;
  }

  const [err] = catchCallbackError(input);
  return !err as any;
}
