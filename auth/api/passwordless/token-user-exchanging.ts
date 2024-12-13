import {
  DetailedAuthenticationResponseDto,
  validateAuthenticationResponseDto,
} from '../dto';
import apiAxios from '@/api-axios'; // assuming apiAxios is imported from your API configuration file

interface TokenUserExchangingRequest {
  token: string;
}

/**
 * Exchanges a passwordless identity token for an authentication token.
 *
 * @param {TokenUserExchangingRequest} payload - The request payload to be sent along.
 * @return {Promise<string>} A promise that resolves to the authentication token.
 */
export async function exchangePasswordlessIdentityTokenToAuthToken(
  payload: TokenUserExchangingRequest,
): Promise<DetailedAuthenticationResponseDto> {
  const response = await apiAxios.post('/auth/passwordless/exchange', payload);

  // Instantiate and validate the response object
  return await validateAuthenticationResponseDto(
    response.data,
    DetailedAuthenticationResponseDto,
  );
}
