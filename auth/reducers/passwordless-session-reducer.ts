import { InitiatePasswordlessSessionResponse } from '@/auth/hooks';

interface PasswordlessSessionStatePayload {
  sessionId: string;
  targetIdentity: string;
  otpAlgorithm?: string | null;
  otpLength: number;
  resendAt: Date;
}
type PasswordlessSessionState = PasswordlessSessionStatePayload | null;

interface SetSessionAction {
  type: 'SET_SESSION';
  payload: InitiatePasswordlessSessionResponse;
  meta: {
    targetIdentity: string;
  };
}

interface ResetSessionAction {
  type: 'RESET_SESSION';
}

type AnyAction = SetSessionAction | ResetSessionAction;

export function passwordlessSessionReducer(
  state: PasswordlessSessionState,
  action: AnyAction,
): PasswordlessSessionState {
  switch (action.type) {
    case 'SET_SESSION':
      return {
        targetIdentity: action.meta.targetIdentity,
        sessionId: action.payload.sessionId,
        otpAlgorithm: action.payload.otpAlgorithm,
        otpLength: action.payload.otpLength,
        resendAt: new Date().addSeconds(action.payload.resendIn),
      };
    case 'RESET_SESSION':
      return emptyPasswordlessSessionState;
    default: {
      const _exhaustiveCheck: never = action;
      console.warn(
        'Passwordless Session Reducer invoked with unexpected action payload',
        _exhaustiveCheck,
      );
      return state;
    }
  }
}

export const emptyPasswordlessSessionState: PasswordlessSessionState = null;
