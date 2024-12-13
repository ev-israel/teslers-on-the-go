import apiAxios from '@/api-axios';
import {
  AuthenticationResponseDto,
  validateAuthenticationResponseDto,
} from './dto';

interface RefreshRequest {
  refreshToken: string;
}

/**
 * Refreshes the authentication token by making a POST request to the authentication refresh endpoint.
 * Validates the response before returning the updated authentication data.
 *
 * @param {RefreshRequest} request - The refresh request containing necessary data to renew the token.
 * @return {Promise<AuthenticationResponseDto>} A promise that resolves with the updated authentication response data.
 */
export async function refreshAuthenticationToken(
  request: RefreshRequest,
): Promise<AuthenticationResponseDto> {
  const response = await apiAxios.post('/auth/refresh', request);

  // Validate the response using the utility function
  return await validateAuthenticationResponseDto(
    response.data,
    AuthenticationResponseDto,
  );
}
