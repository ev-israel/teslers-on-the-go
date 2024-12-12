import { MutationOptions, useMutation } from '@tanstack/react-query';
import apiAxios from '@/api-axios';

interface InitiatePasswordlessSessionBody {
  identity: string;
}

export interface InitiatePasswordlessSessionResponse {
  sessionId: string;
  otpAlgorithm: null | 'luhn' | string;
  otpLength: number;
  resendIn: number;
}

async function initiatePasswordlessSession(
  payload: InitiatePasswordlessSessionBody,
) {
  const response = await apiAxios.post<InitiatePasswordlessSessionResponse>(
    '/auth/init-passwordless',
    payload,
  );

  return response.data;
}

export function useInitiatePasswordlessSessionMutation(
  options?: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof initiatePasswordlessSession>>,
      null,
      InitiatePasswordlessSessionBody
    >,
    'mutationFn'
  >,
) {
  return useMutation({
    ...options,
    mutationFn: initiatePasswordlessSession,
  });
}
