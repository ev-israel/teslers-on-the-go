import { RESOLUTION_SEC, useLeftTime } from '@/hooks/useLeftTime';
import { isSuccessful } from '@/utils/catch';
import { createStrictContextHook } from '@/utils/create-context-hooks';
import {
  useInitiatePasswordlessSessionMutation,
  useValidatePasswordlessSessionMutation,
} from '../hooks';
import {
  emptyPasswordlessSessionState,
  passwordlessSessionReducer,
} from '@/auth/reducers/passwordless-session-reducer';
import { createContext, ReactNode, useMemo, useReducer } from 'react';

interface PasswordlessValidationContext {
  /** Indicates whether a code has been sent to any identity target */
  readonly isCodeSent: boolean;
  /** Indicates whether the user can request a resend for the code */
  readonly canResendCode: boolean;
  /** Indicates (in seconds) how much time is left before the user can resend the code */
  readonly resendCodeAfter: number;

  /** The instant validation algorithm used to generate the OTP */
  readonly codeValidationAlgorithm?: string | null;
  /** The length of the expected entered OTP code */
  readonly codeLength: number;

  /**
   * Requests the server to issue an OTP code to the provided identity
   * @param identity The target identity to issue the code for. Can be either an email or a phone number with a country code.
   */
  sendCode(identity: string): Promise<boolean>;

  /**
   * Requests the server to re-send the code to the identity of the current passwordless session
   */
  resendCode(): Promise<boolean>;

  /**
   * Requests the server to validate and verify the given code
   * @param code The entered code by the user
   */
  validateCode(code: string): Promise<boolean>;
}
const PasswordlessValidationContext =
  createContext<PasswordlessValidationContext>(null!);

interface PasswordlessValidationContextProps {
  children: ReactNode;

  /**
   * Being called when the entered by the user code has been verified by the server.
   * @param identityToken A unique, short-living token purposed to be immediately used to perform another action, i.g. exchanging for a proper authentication credentials, or authorized a sensitive action
   */
  onSuccess(identityToken: string): void;
}

export function PasswordlessValidationContextProvider(
  props: PasswordlessValidationContextProps,
) {
  const [session, dispatchSession] = useReducer(
    passwordlessSessionReducer,
    emptyPasswordlessSessionState,
  );

  const initiateSessionMutation = useInitiatePasswordlessSessionMutation({
    onSuccess(data, variables) {
      dispatchSession({
        type: 'SET_SESSION',
        payload: data,
        meta: {
          targetIdentity: variables.identity,
        },
      });
    },
  });
  const validateSessionMutation = useValidatePasswordlessSessionMutation({
    onSuccess(identityToken) {
      dispatchSession({ type: 'RESET_SESSION' });
      props.onSuccess?.(identityToken);
    },
  });

  const [leftTimeForResendToBecomeAvailable, isResendAvailable] = useLeftTime(
    session?.resendAt,
    RESOLUTION_SEC,
  );

  const context = useMemo<PasswordlessValidationContext>(() => {
    return {
      isCodeSent: Boolean(session),
      resendCodeAfter: leftTimeForResendToBecomeAvailable || NaN,
      canResendCode: isResendAvailable,

      codeValidationAlgorithm: session?.otpAlgorithm,
      codeLength: session?.otpLength || NaN,

      async sendCode(identity: string): Promise<boolean> {
        return await isSuccessful(
          initiateSessionMutation.mutateAsync({
            identity,
          }),
        );
      },
      async resendCode(): Promise<boolean> {
        if (!session)
          throw new Error('Code resending is unavailable before first send');

        return await isSuccessful(
          initiateSessionMutation.mutateAsync({
            identity: session.targetIdentity,
          }),
        );
      },
      async validateCode(code: string): Promise<boolean> {
        if (!session)
          throw new Error('Code validation is unavailable before first send');

        return await isSuccessful(
          validateSessionMutation.mutateAsync({
            sessionId: session.sessionId,
            otp: code,
          }),
        );
      },
    };
  }, [
    initiateSessionMutation,
    isResendAvailable,
    leftTimeForResendToBecomeAvailable,
    session,
    validateSessionMutation,
  ]);

  return (
    <PasswordlessValidationContext.Provider value={context}>
      {props.children}
    </PasswordlessValidationContext.Provider>
  );
}

export const usePasswordlessValidationContext = createStrictContextHook(
  PasswordlessValidationContext,
  'PasswordlessValidationContext',
);
