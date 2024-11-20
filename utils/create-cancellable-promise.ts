import CancellationToken from 'cancellationtoken';

type PromiseResolver<T> = (value: T | PromiseLike<T>) => void;
type PromiseRejector = (reason?: any) => void;

export type CancellablePromise<T> = [
  promise: Promise<T>,
  cancel: (reason?: string) => void,
];

export function createCancellablePromise<T>(
  executor: (resolve: PromiseResolver<T>, reject: PromiseRejector) => void,
  handleCancelRequest?: (reason: string) => void,
): CancellablePromise<T> {
  const { token, cancel } = CancellationToken.create();
  if (handleCancelRequest) token.onCancelled(handleCancelRequest);
  const promise = token.racePromise(
    new Promise<T>((resolve, reject) => {
      executor(resolve, reject);
    }),
  );
  return [promise, cancel];
}
