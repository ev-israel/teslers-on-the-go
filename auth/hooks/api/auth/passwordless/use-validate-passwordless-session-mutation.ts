/* eslint-disable prettier/prettier */
import { MutationOptions, useMutation } from '@tanstack/react-query';
import apiAxios from '@/api-axios';
import { IsBoolean, IsString, ValidateNested, validateOrReject } from 'class-validator';
import { plainToInstance, Type } from 'class-transformer';

interface ValidateOtpArgs {
  otp: string;
  sessionId: string; // Added sessionId to the arguments
}

class ValidateOtpResponse {
  @IsBoolean()
  success!: boolean;
}

class SuccessfulValidationResponse extends ValidateOtpResponse {
  @IsString()
  token!: string;
}

class FailedValidationResponse extends ValidateOtpResponse {}

class ResponseWrapper {
  @ValidateNested()
  @Type(() => ValidateOtpResponse, {
    discriminator: {
      property: 'success',
      subTypes: [
        { value: SuccessfulValidationResponse, name: true as any },
        { value: FailedValidationResponse, name: false as any },
      ]
    }
  })
  data!: SuccessfulValidationResponse | FailedValidationResponse;
}

async function validateOtp(payload: ValidateOtpArgs) {
  const response = await apiAxios.post(
    '/auth/validate-passwordless',
    payload,
  );

  const responseData = plainToInstance(ResponseWrapper, { data: response.data }).data;
  await validateOrReject(responseData);

  if (responseData instanceof FailedValidationResponse) throw new Error('Incorrect OTP');
  return responseData.token;
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
