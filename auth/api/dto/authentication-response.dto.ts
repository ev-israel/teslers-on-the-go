import { AuthenticatedUserDto } from '@/auth/api/dto/authenticated-user.dto';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import {
  IsNumber,
  IsString,
  ValidateNested,
  validateOrReject,
} from 'class-validator';

export class AuthenticationResponseDto {
  @IsString()
  accessToken!: string;

  @IsString()
  refreshToken!: string;

  @IsNumber()
  expiresIn!: number;
}

export class DetailedAuthenticationResponseDto extends AuthenticationResponseDto {
  @ValidateNested()
  user!: AuthenticatedUserDto;
}

export async function validateAuthenticationResponseDto<
  T extends AuthenticationResponseDto,
>(data: any, schema: ClassConstructor<T>): Promise<T> {
  const instance = plainToInstance(schema, data);
  await validateOrReject(instance);
  return instance;
}
