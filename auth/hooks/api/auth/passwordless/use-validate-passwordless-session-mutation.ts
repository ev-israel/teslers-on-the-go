import { MutationOptions, useMutation } from '@tanstack/react-query';
import apiAxios from '@/api-axios';

interface ValidateOtpArgs {
  otp: string;
  sessionId: string; // Added sessionId to the arguments
}

interface ValidateOtpResponse {
  success: boolean;
  token?: string;
}

async function validateOtp(payload: ValidateOtpArgs) {
  const response = await apiAxios.post<ValidateOtpResponse>(
    '/auth/validate-passwordless',
    payload,
  );

  if (!response.data.success) throw new Error('Incorrect OTP');
  if (!response.data.token) throw new Error('No token');
  return response.data.token;
}

export function useValidatePasswordlessSessionMutation(
  options?: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof validateOtp>>,
      null,
      ValidateOtpArgs
    >,
    'mutationFn'
  >,
) {
  return useMutation({
    ...options,
    mutationFn: validateOtp,
  });
}
