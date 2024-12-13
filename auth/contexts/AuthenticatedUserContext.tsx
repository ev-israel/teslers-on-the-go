import { exchangePasswordlessIdentityTokenToAuthToken } from '@/auth/api/passwordless/token-user-exchanging';
import { refreshAuthenticationToken } from '@/auth/api/refresh-authentication-token';
import { createStrictContextHook } from '@/utils/create-context-hooks';
import {
  createContext,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface AuthenticatedStatePayload {
  readonly isAuthenticated: true;
  readonly user: User;
}
interface UnauthenticatedStatePayload {
  readonly isAuthenticated: false;
  readonly user: null;
}
type AnyAuthenticationStatePayload =
  | AuthenticatedStatePayload
  | UnauthenticatedStatePayload;

type AuthenticatedUserContext = AnyAuthenticationStatePayload & {
  authWithPasswordlessToken(token: string): Promise<void>;
  refreshToken(): Promise<void>;
  getToken(): Promise<string>;
  getToken(cb: (token: string) => void): void;
};

const AuthenticatedUserContext = createContext<AuthenticatedUserContext | null>(
  null,
);

interface AuthenticatedUserProviderProps {
  children: ReactNode;
}
export function AuthenticatedUserProvider({
  children,
}: AuthenticatedUserProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);

  const authenticationStatePayload =
    useMemo((): AnyAuthenticationStatePayload => {
      if (user) {
        return {
          isAuthenticated: true,
          user,
        };
      }
      return {
        isAuthenticated: false,
        user: null,
      };
    }, [user]);

  const requestAndStoreFreshToken = useCallback(async () => {
    if (!refreshToken) throw new Error('No refresh token');

    const response = await refreshAuthenticationToken({ refreshToken });
    setAccessToken(response.accessToken);
    setRefreshToken(response.refreshToken);
    setExpiresAt(new Date().addSeconds(response.expiresIn));
    return response.accessToken;
  }, [refreshToken]);

  const context = useMemo(
    (): AuthenticatedUserContext => ({
      ...authenticationStatePayload,
      async authWithPasswordlessToken(token: string) {
        const response = await exchangePasswordlessIdentityTokenToAuthToken({
          token,
        });

        setUser(response.user);
        setAccessToken(response.accessToken);
        setRefreshToken(response.refreshToken);
        setExpiresAt(new Date().addSeconds(response.expiresIn));
      },
      async refreshToken(): Promise<void> {
        await requestAndStoreFreshToken();
      },
      getToken: ((cb?: (token: string) => void): Promise<string> | void => {
        const getFreshToken = async () => {
          return await requestAndStoreFreshToken();
        };

        const getToken = async () => {
          if (!accessToken || !expiresAt || Date.now() > expiresAt.getTime())
            return await getFreshToken();
          return accessToken;
        };

        if (cb) getToken().then((token) => cb(token));
        else return getToken();
      }) as any,
    }),
    [authenticationStatePayload, requestAndStoreFreshToken, refreshToken],
  );

  return (
    <AuthenticatedUserContext.Provider value={context}>
      {children}
    </AuthenticatedUserContext.Provider>
  );
}

export const useAuthenticatedUser = createStrictContextHook(
  AuthenticatedUserContext,
  'AuthenticatedUserContext',
);
